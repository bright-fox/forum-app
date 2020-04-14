import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../contexts/UserContext';
import { Link, useParams } from 'react-router-dom';
import { requestProtectedResource } from '../../api';
import { isEmpty, notImplemented } from '../../utils';

const UserSettings = () => {
    const { state } = useContext(UserContext);
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [activeTab,] = useState("account");

    useEffect(() => {
        if (!state.isLoggedIn || state.currUser.id !== userId) return;
        const fetchData = async _ => {
            const res = await requestProtectedResource({ method: "GET", path: `/users/${userId}/private` });
            if (res.status !== 200) return setUser({});
            const data = await res.json();
            setUser(data.user);
        }
        fetchData();
    }, [state.isLoggedIn, state.currUser, userId]);

    if (!user || isEmpty(user)) {
        return <div className="ui segment placeholder flex center"><h1>You have no business here!</h1></div>
    }

    return (
        <div className="ui segment">
            <div className="ui top attached tabular menu mobile-overflowX-scroll">
                <div className={`${activeTab === "account" ? " active " : " "} item pointer mobile-size`} onClick={notImplemented}>Account</div>
                <div className={`${activeTab === "profile" ? " active " : " "} item pointer mobile-size`} onClick={notImplemented}>Profile</div>
                <div className={`${activeTab === "privacy" ? " active " : " "} item pointer mobile-size`} onClick={notImplemented}>Privacy &amp; Security</div>
                <div className={`${activeTab === "notification" ? " active " : " "} item pointer mobile-size`} onClick={notImplemented}>Notification Settings</div>
            </div>
            <div className="ui bottom attached segment stackable grid">
                <div className="row">
                    <div className="five wide column">
                        <img src={`${process.env.PUBLIC_URL}/assets/avatars/${user.gender}.png`} alt="user avatar" className="ui small circular image" />
                        <Link to="#" onClick={notImplemented} className="small link">Change your profile picture</Link>
                    </div>
                    <div className="eleven wide column">
                        <div style={{ justifyContent: "space-between" }} className="flex mb-3">
                            <div className="flex col-dir">
                                <div className="bold medium mb-1">Username</div>
                                <div>{user.username}</div>
                            </div>
                            <button className="ui button mini basic orange" onClick={notImplemented}>Change</button>
                        </div>
                        <div style={{ justifyContent: "space-between" }} className="flex mb-3">
                            <div className="flex col-dir">
                                <div className="bold medium mb-1">E-Mail</div>
                                <div>{user.email}</div>
                            </div>
                            <button className="ui button mini basic orange" onClick={notImplemented}>Change</button>
                        </div>
                        <div style={{ justifyContent: "space-between" }} className="flex mb-3">
                            <div className="flex col-dir">
                                <div className="bold medium mb-1">Gender</div>
                                <div>{user.gender}</div>
                            </div>
                            <button className="ui button mini basic orange" onClick={notImplemented}>Change</button>
                        </div>
                        <div style={{ justifyContent: "space-between" }} className="flex mb-3">
                            <div className="flex col-dir">
                                <div className="bold medium mb-1">Biography</div>
                                <div>{user.biography}</div>
                            </div>
                            <button className="ui button mini basic orange" onClick={notImplemented}>Change</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default UserSettings;