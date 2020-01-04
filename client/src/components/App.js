import React, { useReducer, useMemo } from "react";
import { Router, Route, Switch } from "react-router-dom";

import history from "../history";
import "../stylesheets/index.css";
import userReducer from "../reducers/userReducer";
import UserContext from "../contexts/UserContext";

import Header from "./Header";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";

const App = () => {
  const initialState = {
    isLoggedIn: localStorage.getItem("isLoggedIn") || false,
    currUser: JSON.parse(localStorage.getItem("currUser"))
  };
  const [state, dispatch] = useReducer(userReducer, initialState);

  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return (
    <UserContext.Provider value={contextValue}>
      <div className="ui container">
        <Router history={history}>
          <Header />
          <div id="content">
            <Switch>
              <Route path="/" exact>
                <HomePage />
              </Route>
              <Route path="/posts/:postId" exact>
                <PostPage />
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    </UserContext.Provider>
  );
};

export default App;
