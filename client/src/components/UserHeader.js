import React, { useState, useContext } from "react";

import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import UserContext from "../contexts/UserContext";
import { request, requestToken } from "../api";
import { LOGOUT } from "../actions";

const UserHeader = () => {
  const { state, dispatch } = useContext(UserContext);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleLogin = () => {
    setShowLogin(true);
  };

  const handleSignUp = () => {
    setShowSignUp(true);
  };

  const handleLogout = async () => {
    const tokenResponse = await requestToken();
    if (tokenResponse.status !== 200) return; // TODO: subject to change

    const { idToken } = await tokenResponse.json();
    const res = await request({
      method: "POST",
      path: "/logout",
      token: idToken,
      body: { refreshToken: localStorage.getItem("refreshToken") }
    });

    if (res.status !== 200) return;
    localStorage.clear();
    dispatch({ type: LOGOUT });
  };

  const renderLoginAndSignUp = () => {
    return (
      <>
        <button className="ui button inverted orange" onClick={handleSignUp}>
          Sign Up
        </button>
        <SignUpForm show={showSignUp} onDismiss={() => setShowSignUp(false)} />
        <button className="ui button orange" onClick={handleLogin}>
          Login
        </button>
        <LoginForm show={showLogin} onDismiss={() => setShowLogin(false)} />
      </>
    );
  };

  const renderLogout = () => {
    return (
      <>
        <button className="ui button grey" onClick={handleLogout}>
          Logout
        </button>
      </>
    );
  };

  return <div className="ui segment no-border">{state.isLoggedIn ? renderLogout() : renderLoginAndSignUp()}</div>;
};

export default UserHeader;
