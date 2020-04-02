import React from "react";

const ErrorDisplay = ({ msg }) => {
    return (
        <div className="ui segment flex center no-border">
            <div className="ui icon header">
                <i className="search icon"></i>
                {msg || "Oops, nothing found.."}
            </div>
        </div>
    )
}

export default ErrorDisplay;