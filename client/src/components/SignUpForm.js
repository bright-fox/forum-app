import React, { useState } from "react";
import Modal from "./Modal";
import { useInput } from "../hooks";
import { request } from "../api";
import { cacheUser, unmountModal } from "../utils";
import { SIGNUP } from "../actions";

const SignUpForm = ({ dispatch }) => {
  const { value: username, bind: bindUsername } = useInput("");
  const { value: email, bind: bindEmail } = useInput("");
  const { value: password, bind: bindPassword } = useInput("");
  const { value: biography, bind: bindBiography } = useInput("");
  const [gender, setGender] = useState("male");

  const handleGenderChange = e => {
    setGender(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const res = await request({
      method: "POST",
      path: "/register",
      body: { username, email, password, biography, gender }
    });
    if (res.status !== 200) return unmountModal();
    const { user, refreshToken } = await res.json();
    const currUser = { id: user._id, username: user.username, gender: user.gender };
    cacheUser(currUser, refreshToken);
    dispatch({ type: SIGNUP, payload: { currUser } });
    unmountModal();
  };

  const renderTitle = () => {
    return <h1>Sign Up</h1>;
  };

  const renderContent = () => {
    return (
      <form className="ui form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="username">Username:</label>
          <input type="text" autoFocus name="username" placeholder="username" {...bindUsername} />
        </div>
        <div className="field">
          <label htmlFor="email">E-Mail:</label>
          <input type="text" name="email" placeholder="email" {...bindEmail} />
        </div>
        <div className="field">
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" placeholder="password" {...bindPassword} />
        </div>
        <div className="inline fields">
          <label htmlFor="gender">Gender:</label>
          <div className="field">
            <div className="ui radio checkbox">
              <input
                type="radio"
                name="gender"
                checked={gender === "male"}
                onChange={handleGenderChange}
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
                checked={gender === "female"}
                onChange={handleGenderChange}
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
                checked={gender === "others"}
                onChange={handleGenderChange}
                value="others"
              />
              <label>others</label>
            </div>
          </div>
        </div>
        <div className="field">
          <label htmlFor="Biography">Biography:</label>
          <textarea rows="5" name="biography" placeholder="Type something about yourself.." {...bindBiography} />
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
