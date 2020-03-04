import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { request } from "../api";
import { isEmpty } from "../utils";

const CommunitySidebar = () => {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await request({ method: "GET", path: "/communities/growing" });
      const data = await res.json();
      setCommunities(data.communities);
    };
    fetchData();
  }, []);

  const renderList = () => {
    return communities.map(item => {
      return (
        <div className="item" key={item._id}>
          <img
            className="ui avatar image"
            src={`${process.env.PUBLIC_URL}/assets/avatars/community_default.jpg`}
            alt="community icon"
          />
          <div className="content">
            <Link className="header" to={`/communities/${item.community._id}`}>
              {item.community.name}
            </Link>
            <div className="description">{item.community.members} Members</div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="ui segment">
      <h2>Growing Communities</h2>
      <div className="ui ordered list">{!isEmpty(communities) ? renderList() : <div>Loading..</div>}</div>
    </div>
  );
};

export default CommunitySidebar;
