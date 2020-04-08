import { useState, useEffect } from "react";
import { errorStatus, successStatus, idleStatus } from "../utils/variables";

export default (initValue = idleStatus) => {
    const [status, setStatus] = useState(initValue);
    const [msg, setMsg] = useState("Oops, something went wrong..");

    useEffect(() => {
        if (status === errorStatus || status === successStatus) {
            const timer = setTimeout(() => {
                setStatus(idleStatus)
            }, 1000)
            return () => clearTimeout(timer);
        }
    }, [status])
    return { status, setStatus, msg, setMsg };
}