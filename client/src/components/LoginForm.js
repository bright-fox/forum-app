import React from "react";

import Modal from "./Modal";

import { useInput } from "../hooks";
import { request } from "../api";
import { LOGIN } from "../actions";
import { cacheUser } from "../utils";

const LoginForm = ({ dispatch, onDismiss }) => {
  const { value: username, bind: bindUsername } = useInput("");
  const { value: password, bind: bindPassword } = useInput("");

  const handleSubmit = async e => {
    e.preventDefault();

    const res = await request({ method: "POST", path: "/login", body: { username, password } });
    if (res.status !== 200) return onDismiss(); // TODO: subject to change
    const data = await res.json();
    cacheUser(data.user, data.refreshToken);
    dispatch({ type: LOGIN, payload: { currUser: data.user } });
    onDismiss();
  };

  const renderTitle = () => {
    return <h1>Login</h1>;
  };

  const renderContent = () => {
    return (
      <form className="ui form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="username">Username: </label>
          <input type="text" autoFocus name="username" placeholder="username" {...bindUsername} />
        </div>
        <div className="field">
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" placeholder="password" {...bindPassword} />
        </div>
        <button className="ui button" type="submit">
          Login
        </button>
        <button className="ui button red" onClick={onDismiss} type="button">
          Cancel
        </button>
      </form>
    );
  };

  return <Modal onDismiss={onDismiss} title={renderTitle()} content={renderContent()} />;
};

export default LoginForm;
