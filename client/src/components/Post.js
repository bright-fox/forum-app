import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";

import VoteArrows from "./VoteArrows";
import "../stylesheets/index.css";

const Post = ({ upvotes, createdAt, community, author, title, content, comments }) => {
  return (
    <div className="ui center segment grid">
      <div className="one wide column">
        <VoteArrows upvotes={upvotes} />
      </div>

      <div className="fifteen wide column wide ui card box-shadow-none p-0">
        <div className="content">
          <div className="right floated meta">{moment(createdAt).fromNow()}</div>
          <img src={`${process.env.PUBLIC_URL}/assets/avatars/kristy.png`} alt="avatar" className="ui avatar image" />
          <Link to={`/communities/${community._id}`}>{community.name}</Link>
          <Link to={`/users/${author._id}`} className="meta">
            ~ posted by u/{author.username}
          </Link>
          <div className="header mt-3">{title}</div>
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
