import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div>
      <div className="ui secondary pointing menu">
        <Link to="/" className="item">
          FORUM
        </Link>
        <div className="right menu">
          <Link to="/login" className="item">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
