import React from "react";
import PostList from "../PostList";

const HomePage = () => {
  return (
    <div className="ui stackable grid centered">
      <div className="row">
        <div className="ten wide column">
          <PostList path="/posts" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
