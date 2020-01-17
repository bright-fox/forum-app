import React, { useContext } from "react";
import LoginButton from "./LoginButton";
import SignUpButton from "./SignUpButton";
import UserContext from "../contexts/UserContext";
import { requestProtectedResource } from "../api";
import { LOGOUT } from "../actions";
import { redirectToAuthModal } from "../utils";

const UserHeader = () => {
  const { state, dispatch } = useContext(UserContext);

  const handleLogout = async () => {
    const res = await requestProtectedResource({
      method: "POST",
      path: "/logout",
      body: { refreshToken: localStorage.getItem("refreshToken") }
    });
    if (!res) return redirectToAuthModal(dispatch);
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

  return (
    <div className="ui segment no-border py-0 flex center m-0">
      {state.isLoggedIn ? renderLogout() : renderAuthButtons()}
    </div>
  );
};

export default UserHeader;
