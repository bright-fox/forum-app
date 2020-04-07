import React, { useState, useEffect, useContext } from "react";
import Post from "./Post";
import { request, appendVotes, requestProtectedResource } from "../api";
import Pagination from "./Pagination";
import UserContext from "../contexts/UserContext";
import Loader from "./Loader";
import { isEmpty } from "../utils";
import ErrorDisplay from "./ErrorDisplay";

const PostList = ({ path }) => {
  const { state } = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState(null);
  const [maxPage, setMaxPage] = useState(1);
  const [trigger, setTrigger] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      // fetch posts
      const conf = {
        method: "GET",
        path: `${path}/page/${currentPage}`
      };
      const res = (state.isLoggedIn) ? await requestProtectedResource(conf) : await request(conf);
      if (res.status !== 200) return setPosts([]);
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
      {posts ? (!isEmpty(posts) ? renderList() : <ErrorDisplay msg="There are no posts yet.." />) : <Loader />}
      {(!posts || !isEmpty(posts)) && <div className="flex center">
        <Pagination currPage={currentPage} maxPage={maxPage} setCurrPage={setCurrentPage} />
      </div>}
    </>
  );
};

export default PostList;
