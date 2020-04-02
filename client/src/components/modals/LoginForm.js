import React from "react";
import Modal from "../Modal";
import useForm from "../../hooks/useForm";
import validateLogin from "../../validation/validateLogin";
import { request } from "../../api";
import { LOGIN } from "../../actions";
import { cacheUser, unmountModal, isEmpty, configError, renderErrMsg, hasErr } from "../../utils";
import ModalCancelButton from "../ModalCancelButton";
import useError from "../../hooks/useError";

const LoginForm = ({ dispatch }) => {
  // use form
  const initValues = { username: "", password: "" };
  const { inputs, handleSubmit, handleInputChange, errors } = useForm(initValues, submitCallback, validateLogin);
  // error on submit
  const { err, setErr, errMsg, setErrMsg } = useError(false);

  // submit callback function
  async function submitCallback(inputs) {
    const res = await request({ method: "POST", path: "/login", body: inputs });
    if (res.status !== 200) return configError(setErr, setErrMsg, "Invalid username or password..")
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
          {renderErrMsg("username")}
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
          {renderErrMsg("password")}
        </div>
        <button className="ui button mini" type="submit">
          Login
        </button>
        <ModalCancelButton />
      </form>
    );
  };

  return <Modal title={<h1>Login</h1>} content={renderContent()} err={err} errMsg={errMsg} />;
};

export default LoginForm;
