import React, { useContext } from "react";
import LoginButton from "./LoginButton";
import SignUpButton from "./SignUpButton";
import UserContext from "../contexts/UserContext";
import { request, requestToken } from "../api";
import { LOGOUT } from "../actions";

const UserHeader = () => {
  const { state, dispatch } = useContext(UserContext);

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
    document.activeElement.blur();
    dispatch({ type: LOGOUT });
  };

  const renderAuthButtons = () => {
    return (
      <>
        <SignUpButton />
        <LoginButton />
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

  return <div className="ui segment no-border">{state.isLoggedIn ? renderLogout() : renderAuthButtons()}</div>;
};

export default UserHeader;
