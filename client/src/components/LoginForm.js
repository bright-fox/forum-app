import React, { useContext } from "react";

import Modal from "./Modal";

import UserContext from "../contexts/UserContext";
import useInput from "../hooks/useInput";
import { request } from "../api";
import { LOGIN } from "../actions";
import { cacheUser } from "../utils";

const LoginForm = ({ show, onDismiss }) => {
  const { dispatch } = useContext(UserContext);
  const { value: username, bind: bindUsername } = useInput("");
  const { value: password, bind: bindPassword } = useInput("");

  const handleSubmit = async e => {
    e.preventDefault();

    const res = await request({ method: "POST", path: "/login", body: { username, password } });
    if (res.status !== 200) {
      return onDismiss(); // TODO: subject to change
    }
    const data = await res.json();
    cacheUser(data.user, data.refreshToken);
    dispatch({ type: LOGIN, payload: { isLoggedIn: true, currUser: data.user } });
    onDismiss();
  };

  const renderTitle = () => {
    return <h1>Login</h1>;
  };

  const renderContent = () => {
    return (
      <form className="ui form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Username: </label>
          <input type="text" name="username" placeholder="username" {...bindUsername} />
        </div>
        <div className="field">
          <label>Password:</label>
          <input type="password" name="password" placeholder="password" {...bindPassword} />
        </div>
        <button className="ui button" type="submit">
          Submit
        </button>
      </form>
    );
  };

  return <Modal show={show} onDismiss={onDismiss} title={renderTitle()} content={renderContent()} />;
};

export default LoginForm;
