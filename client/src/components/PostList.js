import React, { useState, useEffect, useContext } from "react";
import Post from "./Post";
import { request, appendVotes } from "../api";
import Pagination from "./Pagination";
import UserContext from "../contexts/UserContext";

const PostList = ({ path }) => {
  const { state } = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [maxPage, setMaxPage] = useState(1);
  const [trigger, setTrigger] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      // fetch posts
      const res = await request({
        method: "GET",
        path: `${path}/page/${currentPage}`
      });
      if (res.status !== 200) return;
      const data = await res.json();

      // if user is logged in, fetch also the posts of the user
      if (state.isLoggedIn) {
        data.posts = await appendVotes(data.posts, "post");
      }

      setMaxPage(parseInt(data.maxPage));
      setPosts(data.posts);
    };
    fetchData();
  }, [currentPage, trigger, path, state.isLoggedIn]);

  const renderList = () => {
    return posts.map(post => {
      return <Post {...post} key={post._id} setTrigger={setTrigger} />;
    });
  };

  return (
    <>
      {renderList()}
      <Pagination currPage={currentPage} maxPage={maxPage} setCurrPage={setCurrentPage} />
    </>
  );
};

export default PostList;
