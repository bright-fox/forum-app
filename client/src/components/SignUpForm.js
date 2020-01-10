import React from "react";
import Modal from "./Modal";
import { request } from "../api";
import { cacheUser, unmountModal } from "../utils";
import { SIGNUP } from "../actions";
import useForm from "../hooks/useForm";

const SignUpForm = ({ dispatch }) => {
  const initValues = { username: "", email: "", password: "", biography: "", gender: "" };
  const submitCallback = async inputs => {
    const res = await request({
      method: "POST",
      path: "/register",
      body: inputs
    });
    if (res.status !== 200) return unmountModal();
    const { user, refreshToken } = await res.json();
    const currUser = { id: user._id, username: user.username, gender: user.gender };
    cacheUser(currUser, refreshToken);
    dispatch({ type: SIGNUP, payload: { currUser } });
    unmountModal();
  };
  const { inputs, handleSubmit, handleInputChange } = useForm(initValues, submitCallback);

  const renderTitle = () => {
    return <h1>Sign Up</h1>;
  };

  const renderContent = () => {
    return (
      <form className="ui form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            autoFocus
            name="username"
            placeholder="username"
            value={inputs.username}
            onChange={handleInputChange}
          />
        </div>
        <div className="field">
          <label htmlFor="email">E-Mail:</label>
          <input type="text" name="email" placeholder="email" value={inputs.email} onChange={handleInputChange} />
        </div>
        <div className="field">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            placeholder="password"
            value={inputs.password}
            onChange={handleInputChange}
          />
        </div>
        <div className="inline fields">
          <label htmlFor="gender">Gender:</label>
          <div className="field">
            <div className="ui radio checkbox">
              <input
                type="radio"
                name="gender"
                checked={inputs.gender === "male"}
                onChange={handleInputChange}
                value="male"
              />
              <label>male</label>
            </div>
          </div>
          <div className="field">
            <div className="ui radio checkbox">
              <input
                type="radio"
                name="gender"
                checked={inputs.gender === "female"}
                onChange={handleInputChange}
                value="female"
              />
              <label>female</label>
            </div>
          </div>
          <div className="field">
            <div className="ui radio checkbox">
              <input
                type="radio"
                name="gender"
                checked={inputs.Modalgender === "others"}
                onChange={handleInputChange}
                value="others"
              />
              <label>others</label>
            </div>
          </div>
        </div>
        <div className="field">
          <label htmlFor="Biography">Biography:</label>
          <textarea
            rows="5"
            name="biography"
            placeholder="Type something about yourself.."
            value={inputs.biography}
            onChange={handleInputChange}
          />
        </div>
        <button className="ui button" type="submit">
          Submit
        </button>
        <button className="ui button red" onClick={unmountModal} type="button">
          Cancel
        </button>
      </form>
    );
  };

  return <Modal title={renderTitle()} content={renderContent()} />;
};

export default SignUpForm;
