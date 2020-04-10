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

// form errors
export const hasErr = (errors, field) => (errors.hasOwnProperty(field) ? "error" : "");
export const renderErrMsg = (errors, field) => hasErr(errors, field) && <small className="error">{errors[field]}</small>;

export const truncateText = (text, end) => {
  if (end === undefined) end = 200;
  if (text.length < end) return text;
  return text.substring(0, end) + " [...]";
}