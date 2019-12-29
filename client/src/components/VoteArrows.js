import React from "react";
import "../stylesheets/index.css";

const VoteArrows = ({ upvotes }) => {
  return (
    <div className="fluid medium flex col-dir center">
      <i className="angle up icon m-0"></i>
      <div className="text">
        <span>{upvotes}</span>
      </div>
      <i className="angle down icon m-0"></i>
    </div>
  );
};

export default VoteArrows;
