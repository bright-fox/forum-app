import React, { useState, useEffect } from "react";

const Dropdown = ({ heading, children }) => {
    const [dropped, setDropped] = useState(false);

    useEffect(() => {
        // window listener for the next click event
        const closeDropdown = () => {
            setDropped(false);
            window.removeEventListener("click", closeDropdown);
        }
        if (!dropped) return;
        window.addEventListener("click", closeDropdown);


        return function cleanUpListener() {
            window.removeEventListener("click", closeDropdown);
        }
    }, [dropped]);

    return (
        <div className="dropdown-container">
            <div className={`dropdown-menu ${!dropped ? "" : " active "}`} onClick={() => setDropped(!dropped)}>
                {heading}
                <i className="dropdown icon"></i>
            </div>
            <div className={`dropdown-options ${!dropped ? "hidden " : ""}`}>
                {children}
            </div>
        </div>
    )
}

export default Dropdown;