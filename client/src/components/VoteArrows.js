import React from "react";
import "../stylesheets/index.css";

const VoteArrows = ({ upvotes, type }) => {
  const size = type === "comment" ? { fontSize: "1rem" } : {};
  const marginFix = type === "comment" ? { marginBottom: "7px" } : {};

  return (
    <div style={size} className="fluid medium flex col-dir center">
      <i style={marginFix} className="angle up icon mr-0"></i>
      <div className="text-center">
        <span>{upvotes}</span>
      </div>
      <i className="angle down icon mr-0"></i>
    </div>
  );
};

export default VoteArrows;
