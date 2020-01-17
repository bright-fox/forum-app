import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PostList from "../PostList";
import { request } from "../../api";

const CommunityPage = () => {
  const { communityId } = useParams();
  const [community, setCommunity] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      // fetch community
      const communityRes = await request({ method: "GET", path: `/communities/${communityId}` });
      const communityData = await communityRes.json();
      setCommunity(communityData.community);
    };
    fetchData();
  }, [communityId]);

  return (
    <>
      <div className="ui segment">
        <h1>{community.name}</h1>
        <p>{community.description}</p>
      </div>

      <PostList path={`/communities/${communityId}/posts`} />
    </>
  );
};

export default CommunityPage;
