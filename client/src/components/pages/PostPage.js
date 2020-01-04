import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Post from "../Post";
import CommentList from "../CommentList";
import { request } from "../../api";

const PostPage = () => {
  // check if props params is
  // state for voting and commenting for later to update after voting or commenting
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await request({ method: "GET", path: `/posts/${postId}` });
      const data = await res.json();
      setPost(data.post);
    };
    fetchPost();
  }, [postId]);

  const renderPost = () => {
    return (
      <>
        <Post {...post}>
          <CommentList postId={postId} />
        </Post>
      </>
    );
  };

  return <>{post ? renderPost() : <div>Loading..</div>}</>;
};

export default PostPage;
