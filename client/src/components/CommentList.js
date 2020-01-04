import React, { useState, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { request } from "../api";
import VoteArrows from "./VoteArrows";

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await request({ method: "GET", path: `/posts/${postId}/comments/page/1` });
      const data = await res.json();
      console.log(data);
      setComments(data.comments);
    };
    fetchPost();
  }, [postId]);

  const renderComments = (comments, isReply) => {
    return comments.map(comment => {
      return (
        <div className={isReply ? "comment-reply" : ""} key={comment._id}>
          <div className="flex row-dir vert-center p-1">
            <VoteArrows upvotes={comment.upvotes} type="comment" />
            <Link className="pl-3" to={`/users/${comment.author._id}`}>
              <img
                className="ui avatar image"
                src={`${process.env.PUBLIC_URL}/assets/avatars/${comment.author.gender}.png`}
                alt="avatar"
              />
            </Link>
            <div className="pl-1">
              <div>
                <Link className="link">{comment.author.username}</Link>
                <div className="meta">~ {moment(comment.createdAt).fromNow()}</div>
              </div>
              <div>{comment.content}</div>
            </div>
          </div>
          <div className="comment-reply" key={comment._id}>
            <div className="flex row-dir vert-center p-1">
              <VoteArrows upvotes={comment.upvotes} type="comment" />
              <Link className="pl-3" to={`/users/${comment.author._id}`}>
                <img
                  className="ui avatar image"
                  src={`${process.env.PUBLIC_URL}/assets/avatars/${comment.author.gender}.png`}
                  alt="avatar"
                />
              </Link>
              <div className="pl-1">
                <div>
                  <Link className="link">{comment.author.username}</Link>
                  <div className="meta">~ {moment(comment.createdAt).fromNow()}</div>
                </div>
                <div>{comment.content}</div>
              </div>
            </div>
            {renderComments(comment.replies, true)}
          </div>
          {renderComments(comment.replies, true)}
        </div>
      );
    });
  };

  return (
    <>
      <div className="ui segment m-0 p-0">{renderComments(comments, false)}</div>
    </>
  );
};

export default CommentList;
