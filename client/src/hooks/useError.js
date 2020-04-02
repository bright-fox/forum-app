import { useState, useEffect } from "react";

export default (initValue) => {
    const [err, setErr] = useState(initValue);
    const [errMsg, setErrMsg] = useState("Oops, something went wrong..");

    useEffect(() => {
        if (!err) return;
        const timer = setTimeout(() => {
            setErr(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [err]);
    return { err, setErr, errMsg, setErrMsg };
}