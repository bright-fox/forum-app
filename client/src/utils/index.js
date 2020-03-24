import React from "react";
import ReactDOM from "react-dom";
import AuthModal from "../components/modals/AuthModal";
import { LOGOUT } from "../actions";

export const isEmpty = obj => Object.keys(obj).length === 0;

export const cacheUser = (user, refreshToken) => {
  localStorage.setItem("isLoggedIn", true);
  localStorage.setItem("currUser", JSON.stringify(user));
  localStorage.setItem("refreshToken", refreshToken);
};

export const unmountModal = () => {
  ReactDOM.unmountComponentAtNode(document.querySelector("#modal"));
  document.querySelector("body").classList.remove("modal__body-open");
};

export const redirectToAuthModal = dispatch => {
  localStorage.clear();
  dispatch({ type: LOGOUT });
  ReactDOM.render(<AuthModal />, document.querySelector("#modal"));
};