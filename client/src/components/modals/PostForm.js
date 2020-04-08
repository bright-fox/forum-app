import React, { useState, useEffect } from "react";
import { request, requestProtectedResource } from "../../api";
import Modal from "../Modal";
import useForm from "../../hooks/useForm";
import ModalCancelButton from "../ModalCancelButton";
import { unmountModal, isEmpty, renderErrMsg, hasErr, configStatus } from "../../utils";
import { edit, create, errorStatus } from "../../utils/variables";
import useStatus from "../../hooks/useStatus";
import validatePost from "../../validation/validatePost";

const PostForm = ({ type, state, id, title, content }) => {
  const initVals = { community: "", title: title || "", content: content || "" };
  const { inputs, handleSubmit, handleInputChange, setField, errors } = useForm(initVals, submitCallback, validatePost);
  const [communities, setCommunities] = useState([]);
  const { status, setStatus, msg, setMsg } = useStatus();


  async function submitCallback(inputs) {
    let res;
    if (type === create) res = await requestProtectedResource({ method: "POST", path: "/posts", body: inputs });
    if (type === edit) res = await requestProtectedResource({ method: "PUT", path: `/posts/${id}`, body: inputs });
    if (res.status === 409) return configStatus(setStatus, setMsg, errorStatus, "You posted that already!");
    if (res.status !== 200) return configStatus(setStatus, setMsg, errorStatus);

    unmountModal();
    window.location.reload(); // subject to change..
  }

  // fetch the communities of the user for the communities dropdown
  useEffect(() => {
    if (type === create) {
      const fetchCommunities = async _ => {
        const res = await request({ method: "GET", path: `/users/${state.currUser.id}/communities` });
        if (res.status !== 200) return;
        const data = await res.json();
        // put admin communities and member communities in one array
        const comms = [...data.adminCommunities, ...data.communities];
        setCommunities(comms);

        // pre select community dropdown if there is a community id and user is member or admin of community
        const url = window.location.href;
        if (/.+\/communities\/[a-zA-Z0-9]{24}$/.test(url)) {
          const parts = url.split("/");
          for (let comm of comms) {
            if (comm._id === parts[parts.length - 1]) return setField("community", parts[parts.length - 1]);
          }
        }
      };
      fetchCommunities();
    }
  }, [type, state.currUser.id, setField]);

  const renderCommunityDropdown = () => {
    return (
      <div className={"field " + hasErr(errors, "community")}>
        <label htmlFor="community">Community</label>
        <select name="community" className="ui search dropdown" value={inputs.community} onChange={handleInputChange}>
          <option value="">Select community..</option>
          {communities.map(community => (
            <option name="community" key={community._id} value={community._id}>
              c/{community.name}
            </option>
          ))}
        </select>
        {renderErrMsg(errors, "community")}
      </div>
    );
  };

  const renderContent = () => {
    return (
      <form className={"ui form " + (!isEmpty(errors) ? " error" : " ")} onSubmit={handleSubmit}>
        {type === create && renderCommunityDropdown()}
        <div className={"field " + hasErr(errors, "title")}>
          <label htmlFor="title">Post Title:</label>
          <input
            type="text"
            name="title"
            placeholder="Post title.."
            autoFocus
            value={inputs.title}
            onChange={handleInputChange}
          />
          {renderErrMsg(errors, "title")}
        </div>
        <div className={"field " + hasErr(errors, "content")}>
          <label htmlFor="content">Content:</label>
          <textarea
            name="content"
            rows="4"
            placeholder="Tell me more about it.."
            value={inputs.content}
            onChange={handleInputChange}
          />
          {renderErrMsg(errors, "content")}
        </div>
        <button type="submit" className="ui button mini">
          Submit
        </button>
        <ModalCancelButton />
      </form>
    );
  };

  return <Modal title={<h1>{type === edit ? "Edit" : "Create"} Post</h1>} content={renderContent()} status={status} msg={msg} />;
};

export default PostForm;
