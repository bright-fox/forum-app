import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Post from "../Post";
import CommentList from "../CommentList";
import CommentForm from "../CommentForm.js";
import { request } from "../../api";
import UserContext from "../../contexts/UserContext";

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
  }, [postId]);

  // const renderAuthButtons = () => {};

  const renderPost = () => {
    return (
      <>
        <Post {...post}>
          {/* {state.isLoggedIn ? <CommentForm /> : renderAuthButtons()} */}
          <CommentForm postId={postId} setTrigger={setTrigger} />
          <CommentList postId={postId} trigger={trigger} />
        </Post>
      </>
    );
  };

  return <>{post ? renderPost() : <div>Loading..</div>}</>;
};

export default PostPage;
