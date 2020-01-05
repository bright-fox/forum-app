import React, { useState, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { request } from "../api";
import VoteArrows from "./VoteArrows";

const CommentList = ({ postId, trigger }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await request({ method: "GET", path: `/posts/${postId}/comments/page/1` });
      const data = await res.json();
      setComments(data.comments);
    };
    fetchPost();
  }, [postId, trigger]);

  const renderComments = (comments, isReply) => {
    return comments.map(comment => {
      return (
        <div className="row py-2" key={comment._id}>
          <div className="one wide column p-0">
            <VoteArrows upvotes={comment.upvotes} type="comment" />
          </div>
          <div className="fifteen wide column flex row-dir vert-center ui grid p-0 m-0">
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
            {renderComments(comment.replies, true)}
          </div>
        </div>
      );
    });
  };

  return <div className="ui padded grid">{renderComments(comments, false)}</div>;
};

export default CommentList;
