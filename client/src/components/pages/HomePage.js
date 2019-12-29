import React from "react";
import PostList from "../PostList";
import "../../stylesheets/index.css";

const HomePage = () => {
  return (
    <div className="ui stackable grid centered">
      <div className="row">
        <div className="ten wide column">
          <PostList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
