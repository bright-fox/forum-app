import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import { useParams, Link } from "react-router-dom";
import PostList from "../PostList";
import { request, requestProtectedResource } from "../../api";
import moment from "moment";
import { isEmpty } from "../../utils";
import UserContext from "../../contexts/UserContext";
import CommunityForm from "../modals/CommunityForm";
import PostForm from "../modals/PostForm";
import { edit, create } from "../../utils/variables";
import history from "../../history";
import AuthBar from "../AuthBar";
import Loader from "../Loader";

const CommunityPage = () => {
  const { communityId } = useParams();
  const [community, setCommunity] = useState({});
  const [membership, setMembership] = useState(null);
  const { state } = useContext(UserContext);
  const [reloadCommunity, setReloadCommunity] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      // fetch community
      const communityRes = await request({ method: "GET", path: `/communities/${communityId}` });
      const communityData = await communityRes.json();
      setCommunity(communityData.community);

      if (!state.isLoggedIn) return setMembership(null);
      // check if user is member of the community
      const membershipRes = await requestProtectedResource({
        method: "GET",
        path: `/communities/${communityId}/members/status`
      });
      if (!membershipRes || membershipRes.status !== 200) return setMembership(null);
      const membershipData = await membershipRes.json();
      setMembership(membershipData);
    };
    fetchData();
  }, [communityId, state.isLoggedIn, reloadCommunity]);

  // ======== On click handlers ============
  const handleLeaveCommunity = async () => {
    if (!membership) return;
    const res = await requestProtectedResource({
      method: "DELETE",
      path: `/communities/${communityId}/members/${membership._id}`
    });
    if (!res || res.status !== 200) return;
    setReloadCommunity({});
  };

  const handleJoinCommunity = async () => {
    if (membership) return;
    const res = await requestProtectedResource({
      method: "POST",
      path: `/communities/${communityId}/members`
    });
    if (!res || res.status !== 200) return;
    setReloadCommunity({});
  };

  const handleEdit = () => {
    ReactDOM.render(
      <CommunityForm type={edit} id={community._id} name={community.name} description={community.description} />,
      document.querySelector("#modal")
    );
  };

  const handleDelete = async () => {
    const res = await requestProtectedResource({
      method: "DELETE",
      path: `/communities/${communityId}`
    });
    if (!res || res.status !== 200) return;
    history.push("/");
  };

  const handleCreatePost = () => {
    ReactDOM.render(<PostForm type={create} state={state} />, document.querySelector("#modal"));
  };

  // ======== Render functions ============
  const renderInfoButtons = () => {
    return (
      <>
        {state.currUser.id !== community.creator._id && !membership && (
          <button className="ui blue button fluid" onClick={handleJoinCommunity}>
            Join Community
          </button>
        )}
        {state.currUser.id !== community.creator._id && membership && (
          <button className="ui red button fluid" onClick={handleLeaveCommunity}>
            Leave Community
          </button>
        )}
        {state.currUser.id === community.creator._id && (
          <div className="mt-3 flex center">
            <button className="ui green button fluid" onClick={handleEdit}>
              Edit
            </button>
            <button className="ui red button fluid" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}
      </>
    );
  };

  const renderCommunityInfo = () => {
    return (
      <div className="ui segment">
        <h1 className="flex align-center">
          <img
            className="ui avatar image middle"
            src={`${process.env.PUBLIC_URL}/assets/avatars/community_default.jpg`}
            alt=""
          />
          {community.name}
        </h1>
        <div className="meta">
          <div>
            Creator: <Link to={`/users/${community.creator._id}`}>{community.creator.username}</Link>
          </div>
          <div>Members: {community.members}</div>
          <div>Since {moment(community.createdAt).format("LL")}</div>
        </div>
        <div className="ui divider"></div>
        <div className="bold">Description</div>
        <p>{community.description}</p>
        {state.isLoggedIn && renderInfoButtons()}
      </div>
    );
  };

  // ======== return statement ============

  return (
    <div className="ui stackable grid">
      <div className="five wide column">
        {!isEmpty(community) ? renderCommunityInfo() : <Loader />}
      </div>
      <div className="eleven wide column">
        {!state.isLoggedIn && <AuthBar text="Login or Sign up to participate!" margin="mb-1" />}
        {state.isLoggedIn && membership && (
          <button className="ui button fluid blue mb-1" onClick={handleCreatePost}>
            Create Post
          </button>
        )}
        <PostList path={`/communities/${communityId}/posts`} />
      </div>
    </div>
  );
};

export default CommunityPage;
