import React, { useContext } from "react";
import ReactDOM from "react-dom";
import LoginForm from "./modals/LoginForm";
import UserContext from "../contexts/UserContext";

const LoginButton = () => {
  const { dispatch } = useContext(UserContext);

  return (
    <button
      className="ui button orange"
      onClick={() => ReactDOM.render(<LoginForm dispatch={dispatch} />, document.querySelector("#modal"))}
    >
      Login
    </button>
  );
};

export default LoginButton;
