import React, { useReducer, useMemo } from "react";
import { Router, Route, Switch } from "react-router-dom";

import history from "../history";
import "../css/index.css";
import useStatus from "../hooks/useStatus";
import userReducer from "../reducers/userReducer";
import UserContext from "../contexts/UserContext";
import StatusContext from '../contexts/StatusContext';

import Header from "./Header";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";
import SearchPage from "./pages/SearchPage";
import CommunityPage from "./pages/CommunityPage";
import CommunitiesPage from "./pages/CommunitiesPage";
import UserProfile from "./pages/UserProfile";
import UserSettings from "./pages/UserSettings";
import Notification from './Notification';
import { errorStatus, successStatus } from "../utils/variables";


const App = () => {
  // user reducer for user context
  const [state, dispatch] = useReducer(userReducer,
    {
      isLoggedIn: localStorage.getItem("isLoggedIn") || false,
      currUser: JSON.parse(localStorage.getItem("currUser"))
    });

  const userContextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  // status reducer for status context
  const [statusState, dispatchStatus] = useStatus();
  const { status, msg } = statusState;

  const statusContextValue = useMemo(() => {
    return { statusState, dispatchStatus }
  }, [statusState, dispatchStatus])

  return (
    <StatusContext.Provider value={statusContextValue}>
      <UserContext.Provider value={userContextValue}>
        <div className="ui container">
          <Router history={history}>
            <Header />
            <div id="content">
              {(status === errorStatus || status === successStatus) && <Notification status={status} msg={msg} />}
              <Switch>
                <Route path="/" exact>
                  <HomePage />
                </Route>
                <Route path="/search">
                  <SearchPage />
                </Route>
                <Route path="/posts/:postId" exact>
                  <PostPage />
                </Route>
                <Route path="/communities" exact>
                  <CommunitiesPage />
                </Route>
                <Route path="/communities/:communityId" exact>
                  <CommunityPage />
                </Route>
                <Route path="/users/:userId" exact>
                  <UserProfile />
                </Route>
                <Route path="/users/:userId/settings" exact>
                  <UserSettings />
                </Route>
              </Switch>
            </div>
          </Router>
        </div>
      </UserContext.Provider>
    </StatusContext.Provider>
  );
};

export default App;
