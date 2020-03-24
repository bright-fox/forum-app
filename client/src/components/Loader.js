import React from "react";

const Loader = () => {
    return (
        <div className="ui segment min-height-small no-border">
            <div className="ui active inverted dimmer">
                <div className="ui mini text loader">
                    Loading..
                </div>
            </div>
        </div>
    );
}

export default Loader;