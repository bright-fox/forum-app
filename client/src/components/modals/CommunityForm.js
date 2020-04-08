import React from "react";
import Modal from "../Modal";
import useForm from "../../hooks/useForm";
import ModalCancelButton from "../ModalCancelButton";
import { requestProtectedResource } from "../../api";
import { unmountModal, isEmpty, hasErr, renderErrMsg, configStatus } from "../../utils";
import { edit, errorStatus } from "../../utils/variables";
import validateCommunity from "../../validation/validateCommunity";
import useStatus from "../../hooks/useStatus";

const CommunityForm = ({ type, id, name, description }) => {
  const { inputs, handleInputChange, handleSubmit, errors } = useForm(
    { name: name || "", description: description || "" },
    submitCallback, validateCommunity
  );

  const { status, setStatus, msg, setMsg } = useStatus();

  async function submitCallback(inputs) {
    const method = type === edit ? "PUT" : "POST";
    const path = type === edit ? `/communities/${id}` : `/communities`;
    const res = await requestProtectedResource({ method, path, body: inputs });
    if (res.status === 409) return configStatus(setStatus, setMsg, errorStatus, "The community name exists already!");
    if (res.status !== 200) return configStatus(setStatus, setMsg, errorStatus);
    unmountModal();
    window.location.reload(); // maybe there is a better alternative?
  };

  const renderContent = () => {
    return (
      <form className={"ui form " + (!isEmpty(errors) ? " error" : " ")} onSubmit={handleSubmit}>
        <div className={"field " + hasErr(errors, "name")}>
          <label htmlFor="name">Communityname: </label>
          <input
            type="text"
            name="name"
            value={inputs.name}
            onChange={handleInputChange}
            autoFocus
            placeholder="name.."
          />
          {renderErrMsg(errors, "name")}
        </div>
        <div className={"field " + hasErr(errors, "description")}>
          <label htmlFor="description">Description: </label>
          <textarea
            rows="4"
            type="text"
            name="description"
            value={inputs.description}
            onChange={handleInputChange}
            placeholder="Describe your community.."
          />
          {renderErrMsg(errors, "description")}
        </div>
        <button type="submit" className="ui button mini">
          Submit
        </button>
        <ModalCancelButton />
      </form>
    );
  };
  return <Modal title={<h1>{type === edit ? "Edit" : "Create"} Community</h1>} content={renderContent()} status={status} msg={msg} />;
};

export default CommunityForm;
