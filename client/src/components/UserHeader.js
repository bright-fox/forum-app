import React, { useState, useContext } from "react";

import LoginForm from "./LoginForm";
import UserContext from "../contexts/UserContext";
import { request, requestToken } from "../api";
import { LOGOUT } from "../actions";

const UserHeader = () => {
  const { state, dispatch } = useContext(UserContext);
  const [showLogin, setShowLogin] = useState(false);

  console.log(showLogin);

  const handleLogin = () => {
    setShowLogin(true);
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
    dispatch({ type: LOGOUT, payload: { isLoggedIn: false, currUser: null } });
  };

  const renderLogin = () => {
    return (
      <>
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

  return <>{state.isLoggedIn ? renderLogout() : renderLogin()}</>;
};

export default UserHeader;
