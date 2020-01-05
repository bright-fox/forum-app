import React, { useContext } from "react";
import ReactDOM from "react-dom";
import SignUpForm from "./SignUpForm";
import UserContext from "../contexts/UserContext";

const SignUpButton = () => {
  const { dispatch } = useContext(UserContext);

  const handleClick = () => {
    const modal = document.querySelector("#modal");
    ReactDOM.render(
      <SignUpForm
        dispatch={dispatch}
        onDismiss={() => {
          ReactDOM.unmountComponentAtNode(modal);
          document.querySelector("body").classList.remove("modal__body-open");
        }}
      />,
      modal
    );
  };

  return (
    <button className="ui button inverted orange" onClick={handleClick}>
      Sign Up
    </button>
  );
};

export default SignUpButton;
