import React from "react";
import PostList from "../PostList";
import CommunitySidebar from "../CommunitySidebar";

const HomePage = () => {
  return (
    <div className="ui stackable grid centered">
      <div className="row">
        <div className="ten wide column">
          <PostList path="/posts" />
        </div>
        <div className="five wide column large screen only">
          <CommunitySidebar />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
