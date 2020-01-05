import React from "react";
import { useInput } from "../hooks";
import { request, requestToken } from "../api";

const CommentForm = ({ postId, setTrigger }) => {
  const { value: content, setValue: setContent, bind: bindContent } = useInput("");

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await requestToken();
    const { idToken } = await res.json();
    await request({
      method: "POST",
      path: `/posts/${postId}/comments`,
      token: idToken,
      body: { content, post: postId }
    });

    setContent("");
    setTrigger({});
  };
  return (
    <form className="ui form segment m-0 box-shadow-none no-border" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="content">Write your comment:</label>
        <textarea {...bindContent} name="content" rows="5" placeholder="Express your thoughts.."></textarea>
        <button type="submit" className="ui button mt-3">
          Submit
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
