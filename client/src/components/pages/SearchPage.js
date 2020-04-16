import React, { useEffect, useState, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import moment from "moment";
import querystring from 'query-string';
import { request, appendVotes } from "../../api";
import Loader from "../Loader";
import ErrorDisplay from "../ErrorDisplay";
import SearchBar from "../Searchbar";
import history from "../../history";
import VoteArrows from "../VoteArrows";
import UserContext from "../../contexts/UserContext";
import { truncateText } from "../../utils";

const SearchPage = () => {
  const location = useLocation();
  let { q: query, tab } = querystring.parse(location.search);
  const [searchResults, setSearchResults] = useState(null);
  const [trigger, setTrigger] = useState({});
  const { state } = useContext(UserContext);

  // simple validation of tab
  tab = ["posts", "communities", "users"].includes(tab) ? tab : "posts";
  const handleTabSwitch = (t) => {
    if (t === tab) return;
    setSearchResults(null);
    history.push(`/search?q=${query}&tab=${t}`)
  }

  useEffect(() => {
    if (!query) return;
    const fetchData = async () => {
      const res = await request({ method: "GET", path: `/${tab}/search?q=${query}` });
      if (res.status !== 200) return setSearchResults([]);
      const data = await res.json();
      if (state.isLoggedIn && tab === "posts") appendVotes(data[tab], "post")
      setSearchResults(data[tab]);
    };
    fetchData();
  }, [query, tab, trigger, state.isLoggedIn]);

  const renderSearchResults = () => {
    if (tab === "posts") {
      return searchResults.map(post => {
        return (
          <div className="item ui grid" key={post._id}>
            <div className="row no-wrap">
              <div className="one wide column flex center">
                <VoteArrows upvotes={post.upvotes} userVote={post.userVote} userVoteId={post.userVoteId} type="post" path={`/votes/posts/${post._id}`} setTrigger={setTrigger} />
              </div>
              <div style={{ alignItems: "center" }} className="fifteen wide column flex">
                <div className="content">
                  <Link to={`/posts/${post._id}`}>{post.title}</Link>
                  <div className="meta">
                    ~ posted in <Link to={`/communities/${post.community._id}`} className="link">{post.community.name}</Link> by u/
                <Link to={`/users/${post.author._id}`} className="link">
                      {post.author.username}</Link>
                    <span className="pl-3">[{moment(post.createdAt).fromNow()}]</span>
                  </div>
                  <div className="description">{truncateText(post.content, 100)}</div>
                </div>
              </div>
            </div>
          </div>
        );
      });
    }

    if (tab === "communities") {
      return searchResults.map(community => {
        return (
          <div className="item" key={community._id}>
            <div className="content">
              <img src={`${process.env.PUBLIC_URL}/assets/avatars/community_default.jpg`} alt="community avatar" className="ui avatar image" />
              <Link to={`/communities/${community._id}`}>c/{community.name}</Link>
              <div className="meta">
                ~by {community.creator} <span className="pl-3">[{community.members} Members]</span>
              </div>
              <div className="description">{truncateText(community.description, 100)}</div>
            </div>
          </div>
        );
      });
    }

    return searchResults.map(user => {
      return (
        <div className="item" key={user._id}>
          <img src={`${process.env.PUBLIC_URL}/assets/avatars/${user.gender}.png`} alt="" className="ui avatar image" />
          <div className="content">
            <Link to={`/users/${user._id}`}>u/{user.username}</Link>
            <div className="meta">[{user.karma} Karma]</div>
            <div className="description">{truncateText(user.biography, 100)}</div>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <div className="ui segment">
        <h3>Search</h3>
        <SearchBar initialValue={query} width="half width" />
      </div>
      {query.length > 0 && <div className="ui segment">
        <h1>Search Results</h1>
        <div className="ui top attached tabular menu">
          <div className={`item pointer mobile-font-size ${tab === "posts" ? "active " : ""}`} onClick={() => handleTabSwitch("posts")}>Posts</div>
          <div className={`item pointer mobile-font-size ${tab === "communities" ? "active " : ""}`} onClick={() => handleTabSwitch("communities")}>Communities</div>
          <div className={`item pointer mobile-font-size ${tab === "users" ? "active " : ""}`} onClick={() => handleTabSwitch("users")}>Users</div>
        </div>
        <div className="ui bottom attached segment">
          <div className="ui relaxed divided list">
            {searchResults ? (searchResults.length > 0 ? renderSearchResults() : <ErrorDisplay />) : <Loader />}
          </div>
        </div>
      </div>}
    </>
  );
};

export default SearchPage;
