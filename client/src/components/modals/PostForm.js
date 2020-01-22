import React, { useState, useEffect } from "react";
import { request, requestProtectedResource } from "../../api";
import Modal from "../Modal";
import useForm from "../../hooks/useForm";
import ModalCancelButton from "../ModalCancelButton";
import { unmountModal } from "../../utils";

const PostForm = ({ type, state }) => {
  const initVals = { community: "", title: "", content: "" };
  const { inputs, handleSubmit, handleInputChange, setField } = useForm(initVals, async inputs => {
    await requestProtectedResource({ method: "POST", path: "/posts", body: inputs });
    unmountModal();
    window.location.reload(); // fetchs all the data again
  });
  const [communities, setCommunities] = useState([]);

  // get the URL community id
  useEffect(() => {
    const url = window.location.href;
    if (/.+\/communities\/[a-zA-Z0-9]{24}$/.test(url)) {
      const parts = url.split("/");
      setField("community", parts[parts.length - 1]);
    }
  }, [setField]);

  // fetch the communities of user
  useEffect(() => {
    const fetchCommunities = async () => {
      const res = await request({ method: "GET", path: `/users/${state.currUser.id}/communities/page/1` });
      const data = await res.json();
      setCommunities(data.communities);
    };
    fetchCommunities();
  }, [state.currUser.id]);

  const renderCommunityDropdown = () => {
    return (
      <div className="field">
        <label htmlFor="community">Community</label>
        <select name="community" className="ui search dropdown" value={inputs.community} onChange={handleInputChange}>
          <option value="">Select community..</option>
          {communities.map(community => (
            <option name="community" key={community._id} value={community._id}>
              c/{community.name}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <form className="ui form" onSubmit={handleSubmit}>
        {renderCommunityDropdown()}
        <div className="field">
          <label htmlFor="title">Post Title:</label>
          <input
            type="text"
            name="title"
            placeholder="Post title.."
            value={inputs.title}
            onChange={handleInputChange}
          />
        </div>
        <div className="field">
          <label htmlFor="content">Content:</label>
          <textarea
            name="content"
            rows="4"
            placeholder="Tell me more about it.."
            value={inputs.content}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="ui button mini">
          Submit
        </button>
        <ModalCancelButton />
      </form>
    );
  };

  return <Modal title={type === "edit" ? <h1>Edit Post</h1> : <h1>Create Post</h1>} content={renderContent()} />;
};

export default PostForm;
