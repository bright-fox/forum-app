import React, { useState, useContext } from "react";
import { requestProtectedResource } from "../api";
import UserContext from "../contexts/UserContext";
import { redirectToAuthModal } from "../utils";
import StatusContext from "../contexts/StatusContext";
import { ERROR } from "../actions";

const VoteArrows = ({ upvotes, type, path, setTrigger, isDeleted, userVote, userVoteId }) => {
  const { state, dispatch } = useContext(UserContext);
  const { statusState, dispatchStatus } = useContext(StatusContext);
  const [vote, setVote] = useState(userVote || 0);
  const [voteId, setVoteId] = useState(userVoteId || null);

  // conditional styles
  const gotVoted = v => (vote === v ? " orange-color pressed " : " ");
  const gotDeleted = isDeleted ? " gray pressed " : " ";

  const handleClick = async v => {
    // redirect unlogged user to sign up or login form
    if (!state.isLoggedIn) return redirectToAuthModal(dispatch);

    // if already voted remove the vote
    if (vote === v) {
      const deleteRes = await requestProtectedResource({ method: "DELETE", path: `/votes/${voteId}/${type}s` });
      if (deleteRes.status !== 200) return dispatchStatus({ type: ERROR });
      setVote(0);
      setVoteId(null)
      // trigger reload of posts or comments
      return setTrigger({});
    }

    // vote for doc
    const res = await requestProtectedResource({ method: "POST", path, body: { vote: v } });
    if (res.status === 401 || res.status === 403) return redirectToAuthModal(dispatch);
    if (res.status !== 200) return dispatchStatus({ type: ERROR });

    const data = await res.json();
    // update vote
    setVote(data[`${type}Vote`].vote);
    setVoteId(data[`${type}Vote`]._id);
    // trigger reload of posts or comments
    setTrigger({});
  };

  return (
    <div className={`fluid flex col-dir center`}>
      <i
        className={"angle up icon" + gotDeleted + gotVoted(1)}
        onClick={() => !isDeleted ? handleClick(1) : null}
      />
      <div style={{ fontSize: "1.1rem" }} className={"default bold" + gotDeleted}>{upvotes}</div>
      <i className={"angle down icon" + gotDeleted + gotVoted(-1)} onClick={() => !isDeleted ? handleClick(-1) : null} />
    </div>
  );
};

export default VoteArrows;
