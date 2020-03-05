import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Post from "../Post";
import CommentList from "../CommentList";
import CommentForm from "../CommentForm.js";
import { request } from "../../api";
import UserContext from "../../contexts/UserContext";
import AuthBar from "../AuthBar";

const PostPage = () => {
  // check if props params is
  // state for voting and commenting for later to update after voting or commenting
  const { postId } = useParams();
  const { state } = useContext(UserContext);
  const [post, setPost] = useState(null);
  const [trigger, setTrigger] = useState({});

  useEffect(() => {
    const fetchPost = async () => {
      const res = await request({ method: "GET", path: `/posts/${postId}` });
      const data = await res.json();
      setPost(data.post);
    };
    fetchPost();
  }, [postId, trigger]);

  const renderPost = () => {
    return (
      <>
        <Post {...post} setTrigger={setTrigger}>
          {state.isLoggedIn ? (
            <CommentForm postId={postId} setTrigger={setTrigger} />
          ) : (
            <AuthBar text="Sign up or Login to comment!" />
          )}
          <CommentList postId={postId} trigger={trigger} setTrigger={setTrigger} />
        </Post>
      </>
    );
  };

  return <>{post ? renderPost() : <div>Loading..</div>}</>;
};

export default PostPage;
