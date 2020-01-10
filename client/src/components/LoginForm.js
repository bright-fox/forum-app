import React from "react";

import Modal from "./Modal";

import useForm from "../hooks/useForm";
import { request } from "../api";
import { LOGIN } from "../actions";
import { cacheUser, unmountModal } from "../utils";

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

  const { inputs, handleSubmit, handleInputChange } = useForm(initValues, callback);

  const renderTitle = () => {
    return <h1>Login</h1>;
  };

  const renderContent = () => {
    return (
      <form className="ui form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            autoFocus
            name="username"
            placeholder="username"
            value={inputs.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            placeholder="password"
            value={inputs.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button className="ui button" type="submit">
          Login
        </button>
        <button className="ui button red" onClick={unmountModal} type="button">
          Cancel
        </button>
      </form>
    );
  };

  return <Modal title={renderTitle()} content={renderContent()} />;
};

export default LoginForm;
