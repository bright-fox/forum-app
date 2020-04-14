import React, { useContext } from "react";
import PostList from "../PostList";
import CommunitySidebar from "../CommunitySidebar";
import UserContext from "../../contexts/UserContext";
import Advertisement from "../Advertisement";
import LinksBlock from "../LinksBlock";

const HomePage = () => {
  const { state } = useContext(UserContext);

  return (
    <div className="ui stackable grid centered">
      <div className="doubling row">
        <div className="sixteen wide tablet ten wide computer column">
          <PostList path={!state.currUser ? "/posts" : `/users/${state.currUser.id}/home`} />
        </div>
        <div className="five wide column computer only">
          <CommunitySidebar />
          <Advertisement />
          <LinksBlock />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
