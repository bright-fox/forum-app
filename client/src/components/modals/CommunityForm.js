import React from "react";
import Modal from "../Modal";
import useForm from "../../hooks/useForm";
import ModalCancelButton from "../ModalCancelButton";
import { requestProtectedResource } from "../../api";
import { redirectToAuthModal, unmountModal } from "../../utils";
import { edit } from "../../utils/variables";

const CommunityForm = ({ type }) => {
  const submitCallback = async inputs => {
    const res = await requestProtectedResource({ method: "POST", path: "/communities", body: inputs });
    if (!res) redirectToAuthModal();
    unmountModal();
    window.location.reload(); // maybe not useful?
  };

  const { inputs, handleInputChange, handleSubmit } = useForm({ name: "", description: "" }, submitCallback);

  const renderTitle = () => (type === edit ? <h1>Edit Community</h1> : <h1>Create Community</h1>);
  const renderContent = () => {
    return (
      <form className="ui form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">Communityname: </label>
          <input type="text" name="name" value={inputs.name} onChange={handleInputChange} placeholder="name.." />
        </div>
        <div className="field">
          <label htmlFor="description">Description: </label>
          <textarea
            rows="4"
            type="text"
            name="description"
            value={inputs.description}
            onChange={handleInputChange}
            placeholder="Describe your community.."
          />
        </div>
        <button type="submit" className="ui button mini">
          Submit
        </button>
        <ModalCancelButton />
      </form>
    );
  };
  return <Modal title={renderTitle()} content={renderContent()} />;
};

export default CommunityForm;
