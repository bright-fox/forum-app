import React from "react";
import { Link } from "react-router-dom";
import UserHeader from "./UserHeader";
import SearchBar from "./Searchbar";

const Header = () => {
  return (
    <>
      <div className="ui fixed borderless menu">
        <Link to="/" id="brand-name" className="item header">
          <img src={`${process.env.PUBLIC_URL}/forum.png`} className="ui avatar" alt="brandimage" />
          Talky
        </Link>
        <Link to="/" className="item">
          Community
        </Link>
        <Link to="/" className="item">
          Posts
        </Link>
        <div className="item">
          <SearchBar />
        </div>
        <div className="right menu">
          <UserHeader />
        </div>
      </div>
    </>
  );
};

export default Header;
