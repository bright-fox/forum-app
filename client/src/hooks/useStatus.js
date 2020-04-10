import { useEffect, useReducer } from "react";
import { errorStatus, successStatus, idleStatus } from "../utils/variables";
import statusReducer from "../reducers/statusReducer";
import { RESET } from "../actions";

export default () => {
    const [state, dispatch] = useReducer(statusReducer, { status: idleStatus, msg: "Oops, something went wrong.." });
    const { status } = state;

    useEffect(() => {
        if (status === errorStatus || status === successStatus) {
            const timer = setTimeout(() => {
                dispatch({ type: RESET })
            }, 1000)
            return () => clearTimeout(timer);
        }
    }, [status])
    return [state, dispatch];
}