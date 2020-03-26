import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CommunitySidebar from "../CommunitySidebar";
import Pagination from "../Pagination";
import UserContext from "../../contexts/UserContext";
import { request } from "../../api";
import { isEmpty } from "../../utils";
import ErrorDisplay from "../ErrorDisplay";
import Loader from "../Loader";

const CommunitiesPage = () => {
    const { state } = useContext(UserContext);
    const [communities, setCommunities] = useState(null);
    const [currPage, setCurrPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);

    useEffect(() => {
        const fetchData = async _ => {
            const res = await request({ method: "GET", path: state.isLoggedIn ? `/users/${state.currUser.id}/communities/page/${currPage}` : `/communities/page/${currPage}` })
            if (res.status !== 200) return setCommunities([]);
            const data = await res.json()
            setCommunities(data.communities);
            setCurrPage(data.currentPage);
            setMaxPage(data.maxPage)
        }
        fetchData();
    }, [state.isLoggedIn, state.currUser, currPage]);

    const renderCommunities = () => {
        return communities.map(community => {
            return (
                <div className="border-hover p-3 black" key={community._id}>
                    <img src={`${process.env.PUBLIC_URL}/assets/avatars/community_default.jpg`} alt="community avatar" className="ui avatar image" />
                    <Link className="link medium bold" to={`/communities/${community._id}`}>{community.name}</Link>
                    <div className="meta">~ <Link className="link gray" to={`/users/${community.creator._id}`}>{community.creator.username}</Link> | Members: {community.members}</div>
                    <div className="description">
                        {community.description}
                    </div>
                </div>
            )
        })
    }

    return (
        <>
            <CommunitySidebar />
            <div className="ui segment">
                <h1>{state.isLoggedIn ? "Your communities" : "Communities"}</h1>
                <div>
                    {communities ? (!isEmpty(communities) ? renderCommunities() : <ErrorDisplay />) : <Loader />}
                </div>

                {maxPage > 1 && <Pagination currPage={currPage} maxPage={maxPage} setCurrPage={setCurrPage} />}
            </div>
        </>
    );
}

export default CommunitiesPage;