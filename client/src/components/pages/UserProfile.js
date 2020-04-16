import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import moment from "moment";
import { request, appendVotes } from "../../api";
import VoteArrows from "../VoteArrows";
import Loader from "../Loader";
import ErrorDisplay from "../ErrorDisplay";
import Pagination from "../Pagination";
import history from "../../history";
import UserContext from "../../contexts/UserContext";
import { truncateText } from "../../utils";
import { selections } from '../../utils/variables';
import Advertisement from "../Advertisement";
import LinksBlock from "../LinksBlock";

const UserProfile = () => {
    const { userId } = useParams();
    const location = useLocation();
    const { state } = useContext(UserContext);
    const query = new URLSearchParams(location.search).get("s");

    const [selection, setSelection] = useState(selections.includes(query) ? query : "posts");
    const [docs, setDocs] = useState(null);
    const [user, setUser] = useState(null);
    const [currPage, setCurrPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const [trigger, setTrigger] = useState({});

    // reset docs
    const resetDocs = () => {
        setDocs(null);
        setCurrPage(1)
        setMaxPage(1)
    }

    // get user information
    useEffect(() => {
        const fetchData = async _ => {
            const res = await request({ method: "GET", path: `/users/${userId}` });
            if (res.status !== 200) return;
            const data = await res.json();
            setUser(data.user);
        }
        fetchData();
    }, [userId]);

    // update selection to query string
    useEffect(() => {
        if (!selections.includes(query)) return;
        resetDocs();
        setSelection(query)
    }, [query]);

    // get the docs of the selection
    useEffect(() => {
        const fetchData = async _ => {
            const res = await request({ method: "GET", path: `/users/${userId}/${selection}/page/${currPage}` });
            if (res.status !== 200) return setDocs([]);
            const data = await res.json();

            // if logged in and docs are either posts or comments, append votes
            if (state.isLoggedIn && (selection === "posts" || selection === "comments")) {
                data[selection] = await appendVotes(data[selection], selection.slice(0, -1));
            }

            setDocs(data[selection]);
            setCurrPage(Number(data.currentPage));
            setMaxPage(Number(data.maxPage));
        }
        fetchData();
    }, [selection, currPage, userId, trigger, state.isLoggedIn]);

    const handleSelection = e => {
        if (e.target.textContent.toLowerCase() === selection) return;
        resetDocs();
        history.push(`/users/${userId}?s=${e.target.textContent.toLowerCase()}`)
        setSelection(e.target.textContent.toLowerCase());
    }

    const renderContent = () => {
        switch (selection) {
            case "posts":
                return docs.map(doc => {
                    return (
                        <div className="border-hover p-3 black ui grid" key={doc._id}>
                            <div className="row no-wrap">
                                <div className="one wide column flex center">
                                    <VoteArrows upvotes={doc.upvotes} userVote={doc.userVote} userVoteId={doc.userVoteId} type="post" path={`/votes/posts/${doc._id}`} setTrigger={setTrigger} />
                                </div>
                                <div className="fifteen wide column">
                                    <Link to={`/posts/${doc._id}`}>{doc.title}</Link>
                                    <div className="meta">
                                        ~ posted in c/<Link className="link" to={`/communities/${doc.community._id}`}>{doc.community.name}</Link> {" "}
                                by u/<Link className="link" to={`/users/${doc.author._id}`}>{doc.author.username}</Link>
                                        <span className="pl-3">[{moment(doc.createdAt).fromNow()}]</span>
                                    </div>
                                    <div className="description">{truncateText(doc.content)}</div>
                                </div>
                            </div>


                        </div >
                    );
                })
            case "communities":
                return docs.map(doc => {
                    return (
                        <div className="border-hover p-3 black" key={doc._id}>
                            <img src={`${process.env.PUBLIC_URL}/assets/avatars/community_default.jpg`} alt="community avatar" className="ui avatar image" />
                            <Link className="link medium bold" to={`/communities/${doc._id}`}>{doc.name}</Link>
                            <div className="meta">~ <Link className="link gray" to={`/users/${doc.creator._id}`}>{doc.creator.username}</Link> | Members: {doc.members}</div>
                            <div className="description">
                                {truncateText(doc.description)}
                            </div>
                        </div>
                    )
                })
            case "comments":
                return docs.map(doc => {
                    return (
                        <div className="border-hover p-3 black ui grid" key={doc._id}>
                            <div className="row no-wrap">
                                <div className="one wide column">
                                    <VoteArrows upvotes={doc.upvotes} userVote={doc.userVote} userVoteId={doc.userVoteId} type="comment" path={`/votes/posts/${doc.post}/comments/${doc._id}`} setTrigger={setTrigger} />
                                </div>
                                <div className="fifteen wide column">
                                    <img src={`${process.env.PUBLIC_URL}/assets/avatars/${doc.author.gender}.png`} alt="user avatar" className="ui image avatar" />
                                    <Link className="link" to={`/users/${doc.author._id}`}>{doc.author.username}</Link>
                                    <div className="meta">
                                        ~ commented on <Link className="link" to={`/posts/${doc.post._id}`}>{doc.post.title}</Link>
                                        <span className="pl-3">[{moment(doc.createdAt).fromNow()}]</span>
                                    </div>
                                    <div>{truncateText(doc.content)}</div>
                                </div>
                            </div>
                        </div>
                    )
                });
            default:
                return;
        }
    }

    const renderUserInfo = () => {
        return (
            <div className="ui segment">
                <h1><img src={`${process.env.PUBLIC_URL}/assets/avatars/${user.gender}.png`} alt="" className="ui avatar image" /> {user.username}</h1>
                <div><span className="bold">Joined</span> {moment(user.createdAt).fromNow()} | {user.karma} <span className="bold">Karma </span></div>
                <br />
                <div className="bold">Things to know about me</div>
                <div>{user.biography}</div>
            </div>
        )
    };


    return (
        <div className="ui stackable centered grid">
            <div className="four wide column">
                {user ? renderUserInfo() : <Loader />}
                <div className="desktop-only"><Advertisement /></div>
                <div className="desktop-only"><LinksBlock /></div>
            </div>
            <div className="twelve wide column">
                <div className="ui segment">
                    <div className="ui top attached tabular menu">
                        <div className={`${selection === "posts" ? "active " : ""} item pointer mobile-font-size`} onClick={handleSelection}>Posts</div>
                        <div className={`${selection === "communities" ? "active " : ""} item pointer mobile-font-size`} onClick={handleSelection}>Communities</div>
                        <div className={`${selection === "comments" ? "active " : ""} item pointer mobile-font-size`} onClick={handleSelection}>Comments</div>
                    </div>
                    <div className="ui bottom attached segment">
                        {docs ? (docs.length > 0 ? renderContent() : <ErrorDisplay />) : <Loader />}
                        {docs && docs.length > 0 && <div className="flex center">
                            <Pagination currPage={currPage} maxPage={maxPage} setCurrPage={setCurrPage} marginTop="20px" />
                        </div>}
                    </div>
                </div>
            </div>
        </div>


    )
}

export default UserProfile;