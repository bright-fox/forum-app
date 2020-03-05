import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import PostList from "../PostList";
import { request, requestProtectedResource } from "../../api";
import moment from "moment";
import { isEmpty } from "../../utils";
import UserContext from "../../contexts/UserContext";

const CommunityPage = () => {
  const { communityId } = useParams();
  const [community, setCommunity] = useState({});
  const [membership, setMembership] = useState(null);
  const { state } = useContext(UserContext);

  console.log(membership);

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
      if (!membershipRes || membershipRes.status !== 200) return;
      const membershipData = await membershipRes.json();
      setMembership(membershipData);
    };
    fetchData();
  }, [communityId, state.isLoggedIn]);

  const handleLeaveCommunity = async () => {
    if (!membership) return;
    const res = await requestProtectedResource({
      method: "DELETE",
      path: `/communities/${communityId}/members/${membership._id}`
    });
    if (!res || res.status !== 200) return;
    setMembership(null);
  };

  const handleJoinCommunity = async () => {
    if (membership) return;
    const res = await requestProtectedResource({
      method: "POST",
      path: `/communities/${communityId}/members`
    });
    if (!res || res.status !== 200) return;
    const data = await res.json();
    setMembership(data.member);
  };

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
            <button className="ui green button fluid">Edit</button>
            <button className="ui red button fluid">Delete</button>
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

  return (
    <div className="ui grid stackable centered">
      <div className="row">
        <div className="eleven wide column">
          <PostList path={`/communities/${communityId}/posts`} />
        </div>
        <div className="five wide column">
          {!isEmpty(community) ? renderCommunityInfo() : <div className="ui segment">Loading..</div>}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
