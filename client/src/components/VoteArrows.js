import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import { request, requestToken } from "../api";
import UserContext from "../contexts/UserContext";
import Modal from "./Modal";

const VoteArrows = ({ upvotes, type, path, setTrigger }) => {
  const { state } = useContext(UserContext);
  const [vote, setVote] = useState(0);

  console.log(vote);

  useEffect(() => {
    if (!state.isLoggedIn) return setVote(0);
    const fetchVote = async () => {
      const tokenRes = await requestToken();
      const { idToken } = await tokenRes.json();
      const res = await request({ method: "GET", path, token: idToken });
      if (res.status !== 200) {
        return setVote(0);
      }
      const data = await res.json();
      setVote(data.vote);
    };
    fetchVote();

    // clean-up
    return setVote(0);
  }, [state.isLoggedIn, path]);

  const handleClick = async e => {
    if (!state.isLoggedIn) {
      const modal = document.querySelector("#modal");
      return ReactDOM.render(<Modal onDismiss={() => ReactDOM.unmountComponentAtNode(modal)} />, modal);
    }
    const vote = e.target.id === "up" ? 1 : -1;
    const tokenRes = await requestToken();
    const { idToken } = await tokenRes.json();
    const res = await request({ method: "POST", path, token: idToken, body: { vote } });
    if (res.status !== 200) {
      return setVote(0);
    }
    const data = await res.json();
    setVote(data.createdVote.vote);
    setTrigger({});
  };

  const onClickUp = vote !== 1 ? handleClick : null;
  const onClickDown = vote !== -1 ? handleClick : null;

  return (
    <div style={type === "comment" ? { fontSize: "1.1rem" } : {}} className="fluid medium flex col-dir center">
      <i
        id="up"
        style={type === "comment" ? { marginBottom: "5px" } : {}}
        disabled
        className={"angle up icon mr-0 " + (vote === 1 ? "orange-color pressed" : "")}
        onClick={onClickUp}
      ></i>
      <div className="text-center">
        <span>{upvotes}</span>
      </div>
      <i
        id="down"
        className={"angle down icon mr-0 " + (vote === -1 ? "orange-color pressed" : "")}
        onClick={onClickDown}
      ></i>
    </div>
  );
};

export default VoteArrows;
