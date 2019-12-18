import React from "react";
import useInput from "../hooks/useInput";
import history from "../history";

const LoginForm = () => {
  const { value: username, bind: bindUsername } = useInput("");
  const { value: password, bind: bindPassword } = useInput("");

  const handleSubmit = e => {
    e.preventDefault();
    alert(`Submitting name ${username} with password: ${password}`);
    history.push("/");
  };

  return (
    <div>
      <h1>Login</h1>
      <form className="ui form" onSubmit={handleSubmit}>
        <div className="field">
          <label for="username">Username: </label>
          <input type="text" name="username" placeholder="username" {...bindUsername} />
        </div>
        <div className="field">
          <label for="password">Password:</label>
          <input type="password" name="password" placeholder="password" {...bindPassword} />
        </div>
        <button className="ui button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
