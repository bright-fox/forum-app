import React from "react";
import Modal from "../Modal";
import { request } from "../../api";
import { cacheUser, unmountModal, isEmpty, hasErr, renderErrMsg } from "../../utils";
import { SIGNUP, ERROR } from "../../actions";
import useForm from "../../hooks/useForm";
import validateRegister from "../../validation/validateRegister";
import ModalCancelButton from "../ModalCancelButton";
import useStatus from "../../hooks/useStatus";

const SignUpForm = ({ dispatch }) => {
  const initValues = { username: "", email: "", password: "", biography: "", gender: "male" };
  const { inputs, handleSubmit, handleInputChange, errors } = useForm(initValues, submitCallback, validateRegister);
  const [state, dispatchStatus] = useStatus();

  async function submitCallback(inputs) {
    const res = await request({
      method: "POST",
      path: "/register",
      body: inputs
    });
    if (res.status !== 200) return dispatchStatus({ type: ERROR });
    const { user, refreshToken } = await res.json();
    const currUser = { id: user._id, username: user.username, gender: user.gender, karma: user.karma };
    cacheUser(currUser, refreshToken);
    dispatch({ type: SIGNUP, payload: { currUser } });
    unmountModal();
  };

  const renderContent = () => {
    return (
      <form className={"ui form " + (!isEmpty(errors) ? " error" : " ")} onSubmit={handleSubmit}>
        <div className={"field " + hasErr(errors, "username")}>
          <label htmlFor="username">Username*:</label>
          <input
            type="text"
            autoFocus
            name="username"
            placeholder="username"
            value={inputs.username}
            onChange={handleInputChange}
          />
          {renderErrMsg(errors, "username")}
        </div>
        <div className={"field " + hasErr(errors, "email")}>
          <label htmlFor="email">E-Mail*:</label>
          <input type="text" name="email" placeholder="email" value={inputs.email} onChange={handleInputChange} />
          {renderErrMsg(errors, "email")}
        </div>
        <div className={"field " + hasErr(errors, "password")}>
          <label htmlFor="password">Password*:</label>
          <input
            type="password"
            name="password"
            placeholder="password"
            value={inputs.password}
            onChange={handleInputChange}
          />
          {renderErrMsg(errors, "password")}
        </div>
        <div className={"inline fields " + hasErr(errors, "gender")}>
          <label htmlFor="gender">Gender*:</label>
          <div className={"field " + hasErr(errors, "gender")}>
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
          <div className={"field " + hasErr(errors, "gender")}>
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
            {renderErrMsg(errors, "gender")}
          </div>
          <div className={"field " + hasErr(errors, "gender")}>
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

  return <Modal title={<h1>Sign Up</h1>} content={renderContent()} status={state.status} msg={state.msg} />;
};

export default SignUpForm;
