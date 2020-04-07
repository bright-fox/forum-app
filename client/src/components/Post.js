import React, { useContext } from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import { Link } from "react-router-dom";
import VoteArrows from "./VoteArrows";
import UserContext from "../contexts/UserContext";
import Modal from "./Modal";
import ModalCancelButton from "./ModalCancelButton";
import { requestProtectedResource } from "../api";
import { unmountModal } from "../utils";
import PostForm from "./modals/PostForm";
import { edit } from "../utils/variables";

const Post = ({ _id, upvotes, createdAt, community, author, title, content, comments, setTrigger, userVote, userVoteId, children }) => {
  const { state } = useContext(UserContext);

  const renderChildren = () => {
    if (!children) return;
    return <>{children}</>;
  };

  const handleEdit = e => {
    e.stopPropagation();
    ReactDOM.render(
      <PostForm type={edit} state={state} id={_id} title={title} content={content} />,
      document.querySelector("#modal")
    );
  };

  const deletePost = async () => {
    await requestProtectedResource({ method: "DELETE", path: `/posts/${_id}` });
    setTrigger({});
    unmountModal();
  };

  const handleDelete = e => {
    e.stopPropagation();
    const content = <div className="half width">Are you sure you want to delete this post?</div>;
    const actions = (
      <>
        <button className="ui button mini" onClick={deletePost}>
          Yes
        </button>
        <ModalCancelButton />
      </>
    );
    ReactDOM.render(<Modal content={content} actions={actions} />, document.querySelector("#modal"));
  };

  return (
    <div className="ui segment grid mt-0">
      <div className="row no-wrap center pb-0">
        <div className="one wide column">
          <VoteArrows type="post" userVote={userVote} userVoteId={userVoteId} upvotes={upvotes} path={`/votes/posts/${_id}`} setTrigger={setTrigger} />
        </div>

        <div className="fifteen wide column wide ui card box-shadow-none p-0">
          <div className="content pl-0">
            <div className="right floated meta">{moment(createdAt).fromNow()}</div>
            <img
              src={`${process.env.PUBLIC_URL}/assets/avatars/community_default.jpg`}
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
            {state.isLoggedIn && state.currUser.id === author._id && (
              <div className="right floated">
                <button className="ui button mini green" onClick={handleEdit}>
                  <div className="text center">
                    <i className="edit icon"></i>
                  </div>
                </button>
                <button className="ui button mini red" onClick={handleDelete}>
                  <div className="text center">
                    <i className="trash alternate icon"></i>
                  </div>
                </button>
              </div>
            )}

            <Link className="block black" to={`/posts/${_id}`}>
              <i className="comment icon"></i>
              {comments} comments
            </Link>
          </div>
        </div>
      </div>
      {children && (
        <div className="row p-0">
          <div className="full-width">{renderChildren()}</div>
        </div>
      )}
    </div>
  );
};

export default Post;
