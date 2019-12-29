import React, { useState, useEffect, useRef } from "react";
import Post from "./Post";
import { request } from "../api";
import "../stylesheets/index.css";

const PostList = () => {
  const [currentPage, setCurrentPage] = useState(0);
  let posts = useRef([]);
  let maxPage = useRef(0);

  useEffect(() => {
    const fetchData = async () => {
      const res = await request({
        method: "GET",
        path: "/posts/page/1"
      });
      const data = await res.json();
      posts.current = data.posts;
      maxPage.current = parseInt(data.maxPage);
      setCurrentPage(parseInt(data.currentPage));
    };
    fetchData();
  }, [currentPage]);

  const renderList = () => {
    return posts.current.map(post => {
      return <Post {...post} key={post._id} />;
    });
  };

  return <>{renderList()}</>;
};

export default PostList;
