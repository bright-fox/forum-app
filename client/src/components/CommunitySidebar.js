import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { request } from "../api";
import { isEmpty } from "../utils";

const CommunitySidebar = () => {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await request({ method: "GET", path: "/communities/growing" });
      if (res.status !== 200) return;
      const data = await res.json();
      // process data
      const latestDate = data[0]["createdAt"];
      const communities = data.filter(d => d.createdAt === latestDate);
      setCommunities(communities);
    };
    fetchData();
  }, []);

  const renderList = () => {
    return communities.map(item => {
      if (!item.community) return "";
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
