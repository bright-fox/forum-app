import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import { Link } from "react-router-dom";
import CommentForm from "./CommentForm";
import { request, requestProtectedResource, appendVotes } from "../api";
import VoteArrows from "./VoteArrows";
import UserContext from "../contexts/UserContext";
import { redirectToAuthModal } from "../utils";

const CommentList = ({ postId, trigger, setTrigger }) => {
  const [comments, setComments] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await request({ method: "GET", path: `/posts/${postId}/comments/page/1` });
      if (res.status !== 200) return;
      const data = await res.json();
      if (state.isLoggedIn) {
        data.comments = await appendVotes(data.comments, "comment");
      }

      setComments(data.comments);
    };
    fetchPost();
  }, [postId, trigger, state.isLoggedIn]);

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

  const handleDelete = async e => {
    const commentId = e.target.getAttribute("data-id");
    const res = await requestProtectedResource({ method: "DELETE", path: `/posts/${postId}/comments/${commentId}` });
    if (!res) redirectToAuthModal(dispatch);
    setTrigger({});
  };

  const renderActions = comment => {
    if (!state.isLoggedIn) return;
    return (
      <div className="meta">
        <span className="link pointer" onClick={handleReply} data-id={comment._id}>
          Reply
        </span>
        {state.currUser.id === comment.author._id && !comment.isDeleted && (
          <span className="link pointer ml-2" onClick={handleDelete} data-id={comment._id}>
            Delete
          </span>
        )}
      </div>
    );
  };

  const renderComments = (comments, isReply) => {
    return comments.map(comment => {
      return (
        <div className="row py-0" key={comment._id}>
          <div className="one wide column p-0">
            <VoteArrows
              upvotes={comment.upvotes}
              type="comment"
              userVote={comment.userVote}
              path={`/votes/posts/${postId}/comments/${comment._id}`}
              setTrigger={setTrigger}
              isDeleted={comment.isDeleted}
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
              <div className={comment.isDeleted ? "italic small gray" : undefined}>{comment.content}</div>
            </div>
            {renderActions(comment)}
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
