import React, { useState, useEffect } from "react";
import { request, requestProtectedResource } from "../../api";
import Modal from "../Modal";
import useForm from "../../hooks/useForm";
import ModalCancelButton from "../ModalCancelButton";
import { unmountModal } from "../../utils";
import { edit, create } from "../../utils/variables";

const PostForm = ({ type, state, id, title, content }) => {
  const initVals = { community: "", title: "", content: "" };
  const { inputs, handleSubmit, handleInputChange, setField, setFields } = useForm(initVals, async inputs => {
    if (type === create) await requestProtectedResource({ method: "POST", path: "/posts", body: inputs });
    if (type === edit) await requestProtectedResource({ method: "PUT", path: `/posts/${id}`, body: inputs });
    unmountModal();
    window.location.reload(); // fetchs all the data again
  });
  const [communities, setCommunities] = useState([]);

  // set fields for the edit form
  useEffect(() => {
    if (type === edit) {
      setFields({ title, content });
    }
  }, [type, setFields, title, content]);

  // fetch the communities of user for create forms
  useEffect(() => {
    if (type === create) {
      const fetchCommunities = async () => {
        const res = await request({ method: "GET", path: `/users/${state.currUser.id}/communities/page/1` });
        if (res.status !== 200) return;
        const data = await res.json();
        setCommunities(data.communities);
      };
      fetchCommunities();
    }
  }, [type, state.currUser.id]);

  // pre select community dropdown if there is a community id
  useEffect(() => {
    if (type === create) {
      const url = window.location.href;
      if (/.+\/communities\/[a-zA-Z0-9]{24}$/.test(url)) {
        const parts = url.split("/");
        setField("community", parts[parts.length - 1]);
      }
    }
  }, [setField, type]);

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
        {type === create && renderCommunityDropdown()}
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

  return <Modal title={type === edit ? <h1>Edit Post</h1> : <h1>Create Post</h1>} content={renderContent()} />;
};

export default PostForm;
