import ReactDOM from "react-dom";

export const cacheUser = (user, refreshToken) => {
  localStorage.setItem("isLoggedIn", true);
  localStorage.setItem("currUser", JSON.stringify(user));
  localStorage.setItem("refreshToken", refreshToken);
};

export const unmountModal = () => {
  ReactDOM.unmountComponentAtNode(document.querySelector("#modal"));
  document.querySelector("body").classList.remove("modal__body-open");
};
