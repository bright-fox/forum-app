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

export const convertKarma = karma => {
  let i;
  const magnitudes = ["K", "Mio", "Bio", "Trio", "Qua", "Qui", "Sex", "Sep", "Oc", "Non", "Dec"];
  if (karma <= 1000) return karma;
  for (i = 0; i < magnitudes.length; i++) {
    karma /= 1000;
    if (karma <= 1000 && karma >= 1) break;
  }
  return `${Math.round((karma + Number.EPSILON) * 100) / 100} ${magnitudes[i]}`
}