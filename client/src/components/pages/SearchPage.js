import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { request } from "../../api";
import { isEmpty } from "../../utils";
import moment from "moment";

const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");
  const [searchResults, setSearchResults] = useState({});

  useEffect(() => {
    if (!query) return;
    const fetchData = async () => {
      const postsRes = await request({ method: "GET", path: `/posts/search?q=${query}` });
      const communitiesRes = await request({ method: "GET", path: `/communities/search?q=${query}` });
      const usersRes = await request({ method: "GET", path: `/users/search?q=${query}` });
      const postsData = await postsRes.json();
      const communitiesData = await communitiesRes.json();
      const usersData = await usersRes.json();
      setSearchResults({ posts: postsData.posts, communities: communitiesData.communities, users: usersData.users });
    };
    fetchData();
  }, [query]);

  const renderSearchResults = () => {
    let posts, users, communities;
    posts = searchResults.posts.map(post => {
      return (
        <div className="item" key={post._id}>
          <div className="content">
            <Link to={`/posts/${post._id}`}>{post.title}</Link>
            <div className="meta">
              ~by u/{post.author}
              <span className="pl-3">[{moment(post.createdAt).fromNow()}]</span>
            </div>
            <div className="description">{post.content.substring(0, 100)}[...]</div>
          </div>
        </div>
      );
    });

    communities = searchResults.communities.map(community => {
      return (
        <div className="item" key={community._id}>
          <div className="content">
            <Link to={`/communities/${community._id}`}>c/{community.name}</Link>
            <div className="meta">
              ~by {community.creator} <span className="pl-3">[{community.members} Members]</span>
            </div>
            <div className="description">{community.description.substring(0, 100)}[...]</div>
          </div>
        </div>
      );
    });

    users = searchResults.users.map(user => {
      return (
        <div className="item" key={user._id}>
          <img src={`${process.env.PUBLIC_URL}/assets/avatars/${user.gender}.png`} alt="" className="ui avatar image" />
          <div className="content">
            <Link to={`/users/${user._id}`}>u/{user.username}</Link>
            <div className="meta">[{user.karma} Karma]</div>
            <div className="description">{user.biography.substring(0, 100)}[...]</div>
          </div>
        </div>
      );
    });

    return (
      <>
        <h3>Posts</h3>
        <div className="ui relaxed divided list">{posts.length > 0 ? posts : <div>No entries found..</div>}</div>
        <h3>Communities</h3>
        <div className="ui relaxed divided list">
          {communities.length > 0 ? communities : <div>No entries found..</div>}
        </div>
        <h3>Users</h3>
        <div className="ui relaxed divided list">{users.length > 0 ? users : <div>No entries found..</div>}</div>
      </>
    );
  };

  return (
    <div className="ui segment">
      <h1>Search Results</h1>
      {!isEmpty(searchResults) ? renderSearchResults() : <div>..Loading</div>}
    </div>
  );
};

export default SearchPage;
