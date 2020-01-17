import React, { useContext } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import UserHeader from "./UserHeader";
import SearchBar from "./Searchbar";
import UserContext from "../contexts/UserContext";
import CommunityForm from "./modals/CommunityForm";

const Header = () => {
  const { state } = useContext(UserContext);

  return (
    <>
      <div className="ui fixed borderless menu">
        <Link to="/" id="brand-name" className="item header">
          <img src={`${process.env.PUBLIC_URL}/forum.png`} className="ui avatar" alt="brandimage" />
          Talky
        </Link>
        <Link to="/" className="item">
          Communities
        </Link>
        <div className="item">
          <SearchBar />
        </div>
        <div className="right menu">
          {state.isLoggedIn && (
            <>
              <Link
                to="/testing"
                className="item pointer"
                onClick={e => {
                  e.preventDefault();
                  ReactDOM.render(<CommunityForm type="create" />, document.querySelector("#modal"));
                }}
              >
                <i className="users icon"></i>
              </Link>
              <Link to="/testing" className="item pointer" onClick={e => e.preventDefault()}>
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
