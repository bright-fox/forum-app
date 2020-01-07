import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import { Link } from "react-router-dom";
import CommentForm from "./CommentForm";
import { request } from "../api";
import VoteArrows from "./VoteArrows";

const CommentList = ({ postId, trigger, setTrigger }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await request({ method: "GET", path: `/posts/${postId}/comments/page/1` });
      const data = await res.json();
      setComments(data.comments);
    };
    fetchPost();
  }, [postId, trigger]);

  const handleReply = e => {
    const container = document.querySelector(`#commentform-${e.target.getAttribute("data-id")}`);
    if (container.dataset.show === "1") {
      container.setAttribute("data-show", "0");
      return ReactDOM.unmountComponentAtNode(container);
    }

    container.setAttribute("data-show", "1");
    ReactDOM.render(
      <CommentForm postId={postId} setTrigger={setTrigger} isReply commentId={e.target.getAttribute("data-id")} />,
      container
    );
  };

  const renderComments = (comments, isReply) => {
    return comments.map(comment => {
      return (
        <div className="row py-2" key={comment._id}>
          <div className="one wide column p-0">
            <VoteArrows
              upvotes={comment.upvotes}
              type="comment"
              path={`/posts/${postId}/comments/${comment._id}/votes`}
              setTrigger={setTrigger}
            />
          </div>
          <div className="fifteen wide column flex col-dir vert-center ui grid p-0 m-0">
            <div>
              <Link to={`/users/${comment.author._id}`}>
                <img
                  className="ui avatar image"
                  src={`${process.env.PUBLIC_URL}/assets/avatars/${comment.author.gender}.png`}
                  alt="avatar"
                />
              </Link>
              <Link to={`/users/${comment.author._id}`} className="link">
                {comment.author.username}
              </Link>
              <div className="meta">~ {moment(comment.createdAt).fromNow()}</div>
              <div className="text-wrap">{comment.content}</div>
            </div>
            <div className="meta">
              <span className="link pointer" onClick={handleReply} data-id={comment._id}>
                Reply
              </span>
            </div>
            <div id={`commentform-${comment._id}`} data-show="0"></div>
            {renderComments(comment.replies, true)}
          </div>
        </div>
      );
    });
  };

  return <div className="ui padded grid">{renderComments(comments, false)}</div>;
};

export default CommentList;
