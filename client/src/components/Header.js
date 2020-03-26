import React, { useContext } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import UserHeader from "./UserHeader";
import SearchBar from "./Searchbar";
import UserContext from "../contexts/UserContext";
import CommunityForm from "./modals/CommunityForm";
import PostForm from "./modals/PostForm";
import { create } from "../utils/variables";

const Header = () => {
  const { state } = useContext(UserContext);

  return (
    <>
      <div className="ui fixed borderless menu">
        <Link to="/" id="brand-name" className="item header">
          <img src={`${process.env.PUBLIC_URL}/icon_default.jpg`} className="ui avatar image" alt="brandimage" />
          Talky
        </Link>
        <Link to="/communities" className="item">
          Communities
        </Link>
        <div className="item">
          <SearchBar />
        </div>
        <div className="right menu">
          {state.isLoggedIn && (
            <>
              <Link
                to="/"
                className="item pointer"
                onClick={e => {
                  e.preventDefault();
                  ReactDOM.render(<CommunityForm type={create} />, document.querySelector("#modal"));
                }}
              >
                <i className="users icon"></i>
              </Link>
              <Link
                to="/"
                className="item pointer"
                onClick={e => {
                  e.preventDefault();
                  ReactDOM.render(<PostForm state={state} type={create} />, document.querySelector("#modal"));
                }}
              >
                <i className="edit icon"></i>
              </Link>
            </>
          )}
          <UserHeader />
        </div>
      </div>
    </>
  );
};

export default Header;
