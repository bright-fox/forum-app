import React from "react";
import ReactDOM from "react-dom";
import useForm from "../hooks/useForm";
import { request, requestToken } from "../api";

const CommentForm = ({ postId, setTrigger, isReply, commentId }) => {
  const submitCallback = async inputs => {
    const body = { content: inputs.content, post: postId };
    if (isReply && commentId) body.replyTo = commentId;

    const res = await requestToken();
    const { idToken } = await res.json();
    await request({
      method: "POST",
      path: `/posts/${postId}/comments`,
      token: idToken,
      body
    });

    // reset text area
    resetField("content");
    // trigger parent rerender
    setTrigger({});
    unmount();
  };

  const { inputs, handleSubmit, handleInputChange, resetField } = useForm({ content: "" }, submitCallback);

  const unmount = () => {
    if (isReply && commentId) {
      const container = document.querySelector(`#commentform-${commentId}`);
      container.setAttribute("data-show", "0");
      ReactDOM.unmountComponentAtNode(container);
    }
  };

  return (
    <form className={"ui form segment m-0 box-shadow-none no-border " + (isReply && "p-0 ")} onSubmit={handleSubmit}>
      <div className="field">
        {!isReply && <label htmlFor="content">Write your comment:</label>}
        <textarea
          value={inputs.content}
          onChange={handleInputChange}
          name="content"
          rows="5"
          placeholder="Express your thoughts.."
          autoFocus={isReply}
        ></textarea>
        <button type="submit" className="ui button mt-3 mini">
          Submit
        </button>
        {isReply && commentId && (
          <button className="ui button red mini" onClick={unmount}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default CommentForm;
