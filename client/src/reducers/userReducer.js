import { LOGIN, LOGOUT, SIGNUP } from "../actions";

export default (state, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, ...action.payload, isLoggedIn: true };
    case SIGNUP:
      return { ...state, ...action.payload, isLoggedIn: true };
    case LOGOUT:
      return { ...state, isLoggedIn: false, currUser: null };
    default:
      return state;
  }
};
