import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";

import VoteArrows from "./VoteArrows";
import "../stylesheets/index.css";

const Post = ({ _id, upvotes, createdAt, community, author, title, content, comments }) => {
  return (
    <div className="ui center segment grid mb-0 p-1 no-wrap">
      <div className="one wide column">
        <VoteArrows upvotes={upvotes} />
      </div>

      <div className="fifteen wide column wide ui card box-shadow-none p-0">
        <div className="content">
          <div className="right floated meta">{moment(createdAt).fromNow()}</div>
          <img
            src={`${process.env.PUBLIC_URL}/assets/avatars/community.png`} // this is for the community..
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
  );
};

export default Post;