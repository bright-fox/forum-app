import React, { useContext } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import UserHeader from "./UserHeader";
import SearchBar from "./Searchbar";
import UserContext from "../contexts/UserContext";
import CommunityForm from "./modals/CommunityForm";
import PostForm from "./modals/PostForm";
import { create } from "../utils/variables";
import history from "../history";

const Header = () => {
  const { state } = useContext(UserContext);

  const toggleIconMenu = () => {
    const iconMenu = document.querySelector(".icon-menu");
    iconMenu.classList.toggle("active");
  }

  const handleLink = (path) => {
    toggleIconMenu();
    history.push(path)
  }

  const handleModal = (modal) => {
    toggleIconMenu();
    ReactDOM.render(modal, document.querySelector("#modal"));
  }

  return (
    <>
      <div className="ui fixed borderless menu">
        <div className="flex center">
          {/* Brand Logo and Name */}
          <Link to="/" id="brand-name" className="item header">
            <img src={`${process.env.PUBLIC_URL}/icon_default.jpg`} className="ui avatar image" alt="brandimage" />
            Talky
          </Link>
          {/* Icon Menu */}
          <div className="icon-menu">
            <div className="item menu-link mobile-only" onClick={toggleIconMenu}>
              <i className="caret square right outline icon"></i>
            </div>
            <div className="item menu-link mobile-only" onClick={() => handleLink("/search?q=")}>
              <i className="icon search "></i>
            </div>
            <div className="item menu-link" onClick={() => handleLink("/communities")}>
              <i className="child icon"></i>
            </div>
            {state.isLoggedIn && (
              <>
                <div className="item menu-link" onClick={() => handleModal(<CommunityForm type={create} />)}>
                  <i className="users icon"></i>
                </div>
                <div className="item menu-link" onClick={() => handleModal(<PostForm state={state} type={create} />)}>
                  <i className="edit icon"></i>
                </div>
              </>
            )}
          </div>
        </div>
        {/* SearchBar Only Desktop */}
        <div style={{ margin: "0 auto 0 auto" }} className="item desktop-only">
          <SearchBar width="quarter width" />
        </div>

        {/* User Related Links */}
        <div style={{ margin: "0 0 0 auto" }} className="item p-0">
          <UserHeader />
        </div>

        {/* Sidebar Toggler Only Mobile */}
        <div className="menu-toggle flex center pointer mobile-only" onClick={toggleIconMenu}><i className="caret square left outline icon"></i></div>

      </div>
    </>
  );
};

export default Header;
