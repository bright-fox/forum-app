import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import moment from "moment";
import { request } from "../../api";
import Loader from "../Loader";
import Pagination from "../Pagination";
import history from "../../history";

const UserProfile = () => {
    const { userId } = useParams();
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("s");

    const [selection, setSelection] = useState(query === "communities" || query === "comments" ? query : "posts");
    const [docs, setDocs] = useState(null);
    const [currPage, setCurrPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);

    useEffect(() => {
        const fetchData = async _ => {
            const res = await request({ method: "GET", path: `/users/${userId}/${selection}/page/${currPage}` });
            if (res.status !== 200) return setDocs([]);
            const data = await res.json();
            console.log(data);
            setDocs(data[selection]);
            setCurrPage(Number(data.currentPage));
            setMaxPage(Number(data.maxPage));
        }
        fetchData();
    }, [selection, currPage, userId]);

    const handleSelection = e => {
        if (e.target.textContent.toLowerCase() === selection) return;
        setDocs(null);
        setCurrPage(1)
        setMaxPage(1)
        history.push(`/users/${userId}?s=${e.target.textContent.toLowerCase()}`)
        setSelection(e.target.textContent.toLowerCase());
    }

    const renderContent = () => {
        switch (selection) {
            case "posts":
                return docs.map(doc => {
                    return (
                        <div className="border-hover p-3 black" key={doc._id}>
                            <Link to={`/posts/${doc._id}`}>{doc.title}</Link>
                            <div className="meta">
                                ~ posted in c/<Link className="link" to={`/communities/${doc.community._id}`}>{doc.community.name}</Link> {" "}
                                by u/<Link className="link" to={`/users/${doc.author._id}`}>{doc.author.username}</Link>
                                <span className="pl-3">[{moment(doc.createdAt).fromNow()}]</span>
                            </div>
                            <div className="description">{doc.content.substring(0, 100)}[...]</div>
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
                                {doc.description}
                            </div>
                        </div>
                    )
                })
            case "comments":
                return docs.map(doc => {
                    return (
                        <div className="border-hover p-3 black" key={doc._id}>
                            <img src={`${process.env.PUBLIC_URL}/assets/avatars/${doc.author.gender}.png`} alt="user avatar" className="ui image avatar" />
                            <Link className="link" to={`/users/${doc.author._id}`}>{doc.author.username}</Link>
                            <div className="meta">
                                ~ commented on <Link className="link" to={`/posts/${doc.post._id}`}>{doc.post.title}</Link>
                                <span className="pl-3">[{moment(doc.createdAt).fromNow()}]</span>
                            </div>
                            <div>{doc.content}</div>
                        </div>
                    )
                });
            default:
                return;
        }
    }

    return (
        <div className="ui segment">
            <div className="ui top attached tabular menu">
                <div className={`${selection === "posts" ? "active " : ""} item pointer`} onClick={handleSelection}>Posts</div>
                <div className={`${selection === "communities" ? "active " : ""} item pointer`} onClick={handleSelection}>Communities</div>
                <div className={`${selection === "comments" ? "active " : ""} item pointer`} onClick={handleSelection}>Comments</div>
            </div>
            <div className="ui bottom attached segment">
                {docs ? renderContent() : <Loader />}
                <Pagination currPage={currPage} maxPage={maxPage} setCurrPage={setCurrPage} />
            </div>
        </div>

    )
}

export default UserProfile;