import React, { useContext } from "react";
import ReactDOM from "react-dom";
import SignUpForm from "./SignUpForm";
import UserContext from "../contexts/UserContext";

const SignUpButton = () => {
  const { dispatch } = useContext(UserContext);

  return (
    <button
      className="ui button inverted orange"
      onClick={() => ReactDOM.render(<SignUpForm dispatch={dispatch} />, document.querySelector("#modal"))}
    >
      Sign Up
    </button>
  );
};

export default SignUpButton;
