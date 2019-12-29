import React from "react";
import { Link } from "react-router-dom";
import UserHeader from "./UserHeader";
import "../stylesheets/index.css";

const Header = () => {
  return (
    <>
      <div className="ui fixed menu">
        <Link to="/" id="brand-name" className="item header">
          <i className="american sign language interpreting icon"></i> Forum Romanum
        </Link>
        <div className="right menu">
          <UserHeader />
        </div>
      </div>
    </>
  );
};

export default Header;
