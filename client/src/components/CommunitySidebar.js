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
      const { _id, name, members } = item.community;
      return (
        <div className="item flex align-center" key={item._id}>
          <img
            className="ui avatar image"
            src={`${process.env.PUBLIC_URL}/assets/avatars/community_default.jpg`}
            alt="community icon"
          />
          <div className="content">
            <Link className="header" to={`/communities/${_id}`}>
              {name}
            </Link>
            <div className="description">{members + (members > 1 ? " Members" : " Member")}</div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="ui segment">
      <h2>Growing Communities</h2>
      <div className="ui ordered divided list">{!isEmpty(communities) ? renderList() : <div>Loading..</div>}</div>
    </div>
  );
};

export default CommunitySidebar;
