import React, { useContext } from "react";
import { Link } from "react-router-dom";
import LoginButton from "./LoginButton";
import SignUpButton from "./SignUpButton";
import Dropdown from "./Dropdown";
import UserContext from "../contexts/UserContext";
import { requestProtectedResource } from "../api";
import { LOGOUT } from "../actions";
import { redirectToAuthModal, convertKarma } from "../utils";

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

  const renderDropdownHeading = () => {
    return (
      <div className="flex center">
        <img src={`${process.env.PUBLIC_URL}/assets/avatars/${state.currUser.gender}.png`} alt="" className="ui avatar image" />
        <div className="flex col-dir mx-2">{state.currUser.username}
          <div className="meta p-0">Karma: {convertKarma(state.currUser.karma)}</div>
        </div>
      </div>
    )
  }

  const renderDropdown = () => {
    return (
      <Dropdown heading={renderDropdownHeading()}>
        <Link to={`/users/${state.currUser.id}?s=posts`} className="dropdown-item">Posts</Link>
        <Link to={`/users/${state.currUser.id}?s=comments`} className="dropdown-item">Comments</Link>
        <Link to={`/users/${state.currUser.id}?s=communities`} className="dropdown-item">Communities</Link>
        <Link to={`/users/${state.currUser.id}/settings`} className="dropdown-item">Settings</Link>
        <div className="dropdown-item" onClick={handleLogout}>Logout</div>
      </Dropdown>
    );
  };

  return (
    <div className="ui segment no-border flex center m-0 p-0">
      {state.isLoggedIn ? renderDropdown() : renderAuthButtons()}
    </div>
  );
};

export default UserHeader;
