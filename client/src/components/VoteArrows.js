import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import { requestProtectedResource } from "../api";
import UserContext from "../contexts/UserContext";
import Modal from "./Modal";
import { redirectToAuthModal } from "../utils";

const VoteArrows = ({ upvotes, type, path, setTrigger, isDeleted, userVote }) => {
  const { state, dispatch } = useContext(UserContext);
  const [vote, setVote] = useState(userVote || 0);

  // styles
  const arrowSize = type === "comment" ? { fontSize: "1.1rem" } : {};
  const arrowMargin = type === "comment" ? { marginBottom: "5px" } : {};
  const voted = v => (vote === v ? "orange-color pressed " : " ");
  const disabled = !state.isLoggedIn || isDeleted ? "gray pressed " : " ";

  const handleClick = async v => {
    if (!state.isLoggedIn) {
      const modal = document.querySelector("#modal");
      return ReactDOM.render(<Modal onDismiss={() => ReactDOM.unmountComponentAtNode(modal)} />, modal);
    }
    const res = await requestProtectedResource({ method: "POST", path, body: { vote: v } });
    if (!res) return redirectToAuthModal(dispatch);
    if (res.status !== 200) return setVote(0);

    const data = await res.json();
    setVote(data[`${type}Vote`].vote);
    setTrigger({});
  };

  const click = v => {
    return vote !== v && state.isLoggedIn && !isDeleted ? handleClick(v) : null;
  };
  return (
    <div style={arrowSize} className="fluid medium flex col-dir center">
      <i
        id="up"
        style={arrowMargin}
        className={"angle up icon mr-0 " + voted(1) + disabled}
        onClick={() => click(1)}
      ></i>
      <div className="text-center">
        <span className={"default " + disabled}>{upvotes}</span>
      </div>
      <i id="down" className={"angle down icon mr-0 " + voted(-1) + disabled} onClick={() => click(-1)}></i>
    </div>
  );
};

export default VoteArrows;
