import React from "react";
import Modal from "../Modal";
import useForm from "../../hooks/useForm";
import validateLogin from "../../validation/validateLogin";
import { request } from "../../api";
import { LOGIN } from "../../actions";
import { cacheUser, unmountModal, isEmpty } from "../../utils";
import ModalCancelButton from "../ModalCancelButton";

const LoginForm = ({ dispatch }) => {
  const initValues = { username: "", password: "" };
  const callback = async inputs => {
    const res = await request({ method: "POST", path: "/login", body: inputs });
    if (res.status !== 200) return unmountModal(); // TODO: subject to change
    const data = await res.json();
    cacheUser(data.user, data.refreshToken);
    dispatch({ type: LOGIN, payload: { currUser: data.user } });
    unmountModal();
  };

  const { inputs, handleSubmit, handleInputChange, errors } = useForm(initValues, callback, validateLogin);

  const hasError = field => (errors.hasOwnProperty(field) ? "error" : "");
  const renderErrorMessage = field => hasError(field) && <small className="error">{errors[field]}</small>;

  const renderContent = () => {
    return (
      <form className={"ui form " + (!isEmpty(errors) ? "error " : "")} onSubmit={handleSubmit}>
        <div className={"field " + hasError("username")}>
          <label htmlFor="username">Username*: </label>
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
        <button className="ui button mini" type="submit">
          Login
        </button>
        <ModalCancelButton />
      </form>
    );
  };

  return <Modal title={<h1>Login</h1>} content={renderContent()} />;
};

export default LoginForm;
