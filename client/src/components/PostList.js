import React, { useState, useEffect } from "react";
import Post from "./Post";
import { request } from "../api";
import Pagination from "./Pagination";

const PostList = ({ path }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [maxPage, setMaxPage] = useState(1);
  const [trigger, setTrigger] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const res = await request({
        method: "GET",
        path: `${path}/page/${currentPage}`
      });
      if (res.status !== 200) return;
      const data = await res.json();
      setMaxPage(parseInt(data.maxPage));
      // setCurrentPage(parseInt(data.currentPage)); not useful
      setPosts(data.posts);
    };
    fetchData();
  }, [currentPage, trigger, path]);

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
