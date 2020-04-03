import React, { useContext } from "react";
import PostList from "../PostList";
import CommunitySidebar from "../CommunitySidebar";
import UserContext from "../../contexts/UserContext";

const HomePage = () => {
  const { state } = useContext(UserContext);

  return (
    <div className="ui stackable grid centered">
      <div className="row">
        <div className="ten wide column">
          <PostList path={!state.currUser ? "/posts" : `/users/${state.currUser.id}/home`} />
        </div>
        <div className="five wide column large screen only">
          <CommunitySidebar />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
