import React, { useContext } from "react";
import ReactDOM from "react-dom";
import LoginForm from "./LoginForm";
import UserContext from "../contexts/UserContext";

const LoginButton = () => {
  const { dispatch } = useContext(UserContext);

  const handleClick = () => {
    const modal = document.querySelector("#modal");
    return ReactDOM.render(
      <LoginForm
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
    <button className="ui button orange" onClick={handleClick}>
      Login
    </button>
  );
};

export default LoginButton;
