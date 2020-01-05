import React, { useState, useEffect, useRef } from "react";
import Post from "./Post";
import { request } from "../api";

const PostList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const maxPage = useRef(0);
  const [trigger, setTrigger] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const res = await request({
        method: "GET",
        path: `/posts/page/${currentPage}`
      });
      const data = await res.json();
      maxPage.current = parseInt(data.maxPage);
      setCurrentPage(parseInt(data.currentPage));
      setPosts(data.posts);
    };
    fetchData();
  }, [currentPage, trigger]);

  const renderList = () => {
    return posts.map(post => {
      return <Post {...post} key={post._id} setTrigger={setTrigger} />;
    });
  };

  return <>{renderList()}</>;
};

export default PostList;
