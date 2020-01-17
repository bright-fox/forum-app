import React from "react";
import Modal from "../Modal";
import { request } from "../../api";
import { cacheUser, unmountModal, isEmpty } from "../../utils";
import { SIGNUP } from "../../actions";
import useForm from "../../hooks/useForm";
import validateRegister from "../../validation/validateRegister";
import ModalCancelButton from "../ModalCancelButton";

const SignUpForm = ({ dispatch }) => {
  const initValues = { username: "", email: "", password: "", biography: "", gender: "male" };

  const submitCallback = async inputs => {
    const res = await request({
      method: "POST",
      path: "/register",
      body: inputs
    });
    if (res.status !== 200) return unmountModal();
    const { user, refreshToken } = await res.json();
    const currUser = { id: user._id, username: user.username, gender: user.gender };
    cacheUser(currUser, refreshToken);
    dispatch({ type: SIGNUP, payload: { currUser } });
    unmountModal();
  };

  const { inputs, handleSubmit, handleInputChange, errors } = useForm(initValues, submitCallback, validateRegister);

  const hasError = field => (errors.hasOwnProperty(field) ? "error" : "");
  const renderErrorMessage = field => hasError(field) && <small className="error">{errors[field]}</small>;

  const renderContent = () => {
    return (
      <form className={"ui form " + (!isEmpty(errors) ? " error" : " ")} onSubmit={handleSubmit}>
        <div className={"field " + hasError("username")}>
          <label htmlFor="username">Username*:</label>
          <input
            type="text"
            autoFocus
            name="username"
            placeholder="username"
            value={inputs.username}
            onChange={handleInputChange}
          />
          {renderErrorMessage("username")}
        </div>
        <div className={"field " + hasError("email")}>
          <label htmlFor="email">E-Mail*:</label>
          <input type="text" name="email" placeholder="email" value={inputs.email} onChange={handleInputChange} />
          {renderErrorMessage("email")}
        </div>
        <div className={"field " + hasError("password")}>
          <label htmlFor="password">Password*:</label>
          <input
            type="password"
            name="password"
            placeholder="password"
            value={inputs.password}
            onChange={handleInputChange}
          />
          {renderErrorMessage("password")}
        </div>
        <div className={"inline fields " + hasError("gender")}>
          <label htmlFor="gender">Gender*:</label>
          <div className={"field " + hasError("gender")}>
            <div className="ui radio checkbox">
              <input
                type="radio"
                name="gender"
                checked={inputs.gender === "male"}
                onChange={handleInputChange}
                value="male"
              />
              <label>male</label>
            </div>
          </div>
          <div className={"field " + hasError("gender")}>
            <div className="ui radio checkbox">
              <input
                type="radio"
                name="gender"
                checked={inputs.gender === "female"}
                onChange={handleInputChange}
                value="female"
              />
              <label>female</label>
            </div>
            {renderErrorMessage("gender")}
          </div>
          <div className={"field " + hasError("gender")}>
            <div className="ui radio checkbox">
              <input
                type="radio"
                name="gender"
                checked={inputs.gender === "others"}
                onChange={handleInputChange}
                value="others"
              />
              <label>others</label>
            </div>
          </div>
        </div>
        <div className="field">
          <label htmlFor="Biography">Biography:</label>
          <textarea
            rows="5"
            name="biography"
            placeholder="Type something about yourself.."
            value={inputs.biography}
            onChange={handleInputChange}
          />
        </div>
        <button className="ui button mini" type="submit">
          Submit
        </button>
        <ModalCancelButton />
      </form>
    );
  };

  return <Modal title={<h1>Sign Up</h1>} content={renderContent()} />;
};

export default SignUpForm;
