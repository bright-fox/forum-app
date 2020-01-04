import React, { useState, useEffect, useRef } from "react";
import Post from "./Post";
import { request } from "../api";
import "../stylesheets/index.css";

const PostList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const maxPage = useRef(0);

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
  }, [currentPage]);

  const renderList = () => {
    return posts.map(post => {
      return <Post {...post} key={post._id} />;
    });
  };

  return <>{renderList()}</>;
};

export default PostList;
