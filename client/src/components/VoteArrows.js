import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import { requestProtectedResource } from "../api";
import UserContext from "../contexts/UserContext";
import Modal from "./Modal";
import { redirectToAuthModal } from "../utils";

const VoteArrows = ({ upvotes, type, path, setTrigger, isDeleted }) => {
  const { state, dispatch } = useContext(UserContext);
  const [vote, setVote] = useState(0);

  // styles
  const commentSize = type === "comment" ? { fontSize: "1.1rem" } : {};
  const commentMargin = type === "comment" ? { marginBottom: "5px" } : {};
  const voted = v => (vote === v ? "orange-color pressed " : " ");
  const disabled = !state.isLoggedIn || isDeleted ? "gray pressed " : " ";

  useEffect(() => {
    if (!state.isLoggedIn) return setVote(0);
    const fetchVote = async () => {
      const res = await requestProtectedResource({ method: "GET", path });
      if (!res) return redirectToAuthModal(dispatch);
      if (res.status !== 200) return setVote(0);
      const data = await res.json();
      setVote(data.vote);
    };
    fetchVote();

    // clean-up
    return setVote(0);
  }, [state.isLoggedIn, path, dispatch]);

  const handleClick = async e => {
    if (!state.isLoggedIn) {
      const modal = document.querySelector("#modal");
      return ReactDOM.render(<Modal onDismiss={() => ReactDOM.unmountComponentAtNode(modal)} />, modal);
    }
    const vote = e.target.id === "up" ? 1 : -1;
    const res = await requestProtectedResource({ method: "POST", path, body: { vote } });
    if (!res) return redirectToAuthModal();
    if (res.status !== 200) return setVote(0);

    const data = await res.json();
    setVote(data.createdVote.vote);
    setTrigger({});
  };

  const click = v => (vote !== v && state.isLoggedIn && !isDeleted ? handleClick : null);

  return (
    <div style={commentSize} className="fluid medium flex col-dir center">
      <i
        id="up"
        style={commentMargin}
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
