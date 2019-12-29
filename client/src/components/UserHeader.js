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
    const tokenResponse = await requestToken(localStorage.getItem("refreshToken"));
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
        <button onClick={handleSignUp}>Sign Up</button>
        <SignUpForm show={showSignUp} onDismiss={() => setShowSignUp(false)} />
        <button onClick={handleLogin}>Login</button>
        <LoginForm show={showLogin} onDismiss={() => setShowLogin(false)} />
      </>
    );
  };

  const renderLogout = () => {
    return (
      <>
        <button onClick={handleLogout}>Logout</button>
      </>
    );
  };

  return <>{state.isLoggedIn ? renderLogout() : renderLoginAndSignUp()}</>;
};

export default UserHeader;
