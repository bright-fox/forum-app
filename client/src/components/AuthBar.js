import React from "react";
import SignUpButton from "./SignUpButton";
import LoginButton from "./LoginButton";

const AuthBar = ({ text }) => {
  return (
    <div className="ui segment m-3">
      <div className="ui two column very relaxed centered stackable grid">
        <div className="middle aligned column bold">{text}</div>
        <div className="middle aligned column">
          <SignUpButton />
          <span className="bold">or </span>
          <LoginButton />
        </div>
      </div>
      <div className="ui vertical divider">
        <i className="caret right icon"></i>
      </div>
    </div>
  );
};

export default AuthBar;
