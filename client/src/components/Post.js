import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import VoteArrows from "./VoteArrows";

const Post = ({ _id, upvotes, createdAt, community, author, title, content, comments, setTrigger, children }) => {
  const renderChildren = () => {
    if (!children) return;
    return <>{children}</>;
  };

  return (
    <div className="ui segment grid">
      <div className="row no-wrap center">
        <div className="one wide column">
          <VoteArrows upvotes={upvotes} path={`/posts/${_id}/votes`} setTrigger={setTrigger} />
        </div>

        <div className="fifteen wide column wide ui card box-shadow-none p-0">
          <div className="content">
            <div className="right floated meta">{moment(createdAt).fromNow()}</div>
            <img
              src={`${process.env.PUBLIC_URL}/assets/avatars/community.png`}
              alt="avatar"
              className="ui avatar image"
            />
            <Link className="link" to={`/communities/${community._id}`}>
              c/{community.name}
            </Link>
            <span className="meta">
              {" "}
              ~ by{" "}
              <Link className="link" to={`/users/${author._id}`}>
                u/{author.username}
              </Link>
            </span>

            <div className="header mt-3">
              <Link to={`/posts/${_id}`}>{title}</Link>
            </div>
            <div className="description">{content}</div>
          </div>

          <div className="content">
            <div className="">
              <i className="comment icon"></i>
              {comments} comments
            </div>
          </div>
        </div>
      </div>
      {children ? (
        <div className="row p-0">
          <div className="full-width">{renderChildren()}</div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Post;
