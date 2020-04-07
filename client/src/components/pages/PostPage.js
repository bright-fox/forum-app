import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Post from "../Post";
import CommentList from "../CommentList";
import CommentForm from "../CommentForm.js";
import { request, requestProtectedResource } from "../../api";
import UserContext from "../../contexts/UserContext";
import AuthBar from "../AuthBar";
import Loader from "../Loader";

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
      // Get if user voted for it already
      if (state.isLoggedIn) {
        const voteRes = await requestProtectedResource({ method: "GET", path: `/votes/posts/${postId}` });
        if (voteRes.status === 200) {
          const voteData = await voteRes.json();
          data.post.userVote = voteData.postVote.vote;
          data.post.userVoteId = voteData.postVote._id;
        }
      }
      setPost(data.post);
    }
    fetchPost();
  }, [postId, trigger, state.isLoggedIn]);

  const renderPost = () => {
    return (
      <>
        <Post {...post} setTrigger={setTrigger}>
          {state.isLoggedIn ? (
            <CommentForm postId={postId} setTrigger={setTrigger} />
          ) : (
              <AuthBar text="Sign up or Login to comment!" margin="m-3" />
            )}
          <CommentList postId={postId} trigger={trigger} setTrigger={setTrigger} />
        </Post>
      </>
    );
  };

  return <>{post ? renderPost() : <Loader />}</>;
};

export default PostPage;
