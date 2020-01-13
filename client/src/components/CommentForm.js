import React, { useContext } from "react";
import ReactDOM from "react-dom";
import useForm from "../hooks/useForm";
import { requestProtectedResource } from "../api";
import { redirectToAuthModal } from "../utils";
import UserContext from "../contexts/UserContext";

const CommentForm = ({ postId, setTrigger, isReply, commentId }) => {
  const { dispatch } = useContext(UserContext);

  const submitCallback = async inputs => {
    const body = { content: inputs.content, post: postId };
    if (isReply && commentId) body.replyTo = commentId;

    const res = await requestProtectedResource({ method: "POST", path: `/posts/${postId}/comments`, body });
    if (!res) return redirectToAuthModal(dispatch);

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
