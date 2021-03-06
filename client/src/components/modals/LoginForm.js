import React from "react";
import Modal from "../Modal";
import useForm from "../../hooks/useForm";
import validateLogin from "../../validation/validateLogin";
import { request } from "../../api";
import { LOGIN, ERROR } from "../../actions";
import { cacheUser, unmountModal, isEmpty, renderErrMsg, hasErr, notImplemented } from "../../utils";
import ModalCancelButton from "../ModalCancelButton";
import useStatus from "../../hooks/useStatus";

const LoginForm = ({ dispatch }) => {
  // use form
  const initValues = { username: "", password: "" };
  const { inputs, handleSubmit, handleInputChange, errors } = useForm(initValues, submitCallback, validateLogin);
  // error on submit
  const [state, dispatchStatus] = useStatus();

  // submit callback function
  async function submitCallback(inputs) {
    const res = await request({ method: "POST", path: "/login", body: inputs });
    if (res.status !== 200) return dispatchStatus({ type: ERROR, payload: { msg: "Invalid username or password.." } })
    const data = await res.json();
    cacheUser(data.user, data.refreshToken);
    dispatch({ type: LOGIN, payload: { currUser: data.user } });
    unmountModal();
  };

  const renderContent = () => {
    return (
      <form className={"ui form " + (!isEmpty(errors) ? "error " : "")} onSubmit={handleSubmit}>
        <div className={"field " + hasErr(errors, "username")}>
          <label htmlFor="username">Username*: </label>
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
          <small style={{ display: "block", float: "right" }} className="link pointer mini" onClick={notImplemented}>Forgot your password?</small>
        </div>
        <button className="ui button mini" type="submit">
          Login
        </button>
        <ModalCancelButton />
      </form >
    );
  };

  return <Modal title={<h1>Login</h1>} content={renderContent()} status={state.status} msg={state.msg} />;
};

export default LoginForm;
