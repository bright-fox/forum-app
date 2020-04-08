import React from "react";

const Notification = ({ status, msg }) => {
    return (
        <div className={`message ${status}-message`}>{msg}</div>
    );
}

export default Notification;