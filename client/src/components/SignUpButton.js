import React from "react";
import history from "../history";

const SignUpButton = () => {
  return (
    <button
      className="ui button inverted orange"
      onClick={() => history.push("/register")}
    >
      Sign Up
    </button>
  );
};

export default SignUpButton;
