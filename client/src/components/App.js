import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import Header from "./Header";
import LoginForm from "./LoginForm";
import history from "../history";

const App = () => {
  return (
    <div className="ui container">
      <Router history={history}>
        <Header />
        <Switch>
          <Route path="/" exact>
            <h1>Hello World</h1>
          </Route>
          <Route path="/login" exact>
            <LoginForm />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
