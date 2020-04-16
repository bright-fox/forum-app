import React, { useContext } from 'react';
import { request } from "../../api";
import useForm from "../../hooks/useForm";
import history from "../../history";
import { cacheUser, isEmpty, hasErr, renderErrMsg } from "../../utils";
import { SIGNUP, ERROR } from "../../actions";
import UserContext from "../../contexts/UserContext"
import validateRegister from "../../validation/validateRegister";
import StatusContext from '../../contexts/StatusContext';

export default () => {
    const { dispatch } = useContext(UserContext);
    const { dispatchStatus } = useContext(StatusContext);
    const { inputs, handleSubmit, handleInputChange, errors, setErrors } = useForm(
        { username: "", email: "", emailConfirm: "", password: "", passwordConfirm: "", biography: "", gender: "male" },
        async inputs => {
            const { username, email, emailConfirm, password, passwordConfirm, biography, gender } = inputs;
            // check if the repeated fields are identical
            const emailErrorMessage = "The e-mails are not identical";
            if (email !== emailConfirm) return setErrors({ ...errors, email: emailErrorMessage, emailConfirm: emailErrorMessage });
            const passwordErrorMessage = "The passwords are not identical";
            if (password !== passwordConfirm) return setErrors({ ...errors, password: passwordErrorMessage, passwordConfirm: passwordErrorMessage })

            const res = await request({ method: "POST", path: "/register", body: { username, email, password, biography, gender } });
            if (res.status !== 200) return dispatchStatus({ type: ERROR });
            // cache user and refreshtoken
            const { user, refreshToken } = await res.json();
            const currUser = { id: user._id, username: user.username, gender: user.gender, karma: user.karma };
            cacheUser(currUser, refreshToken);
            dispatch({ type: SIGNUP, payload: { currUser } });
            history.goBack();
        },
        validateRegister
    )

    return (
        <div className="ui segment">
            <h1>Sign Up</h1>
            <form className={"ui form " + (!isEmpty(errors) ? " error" : " ")} onSubmit={handleSubmit}>
                <div className={"field " + hasErr(errors, "username")}>
                    <label htmlFor="username">Username*:</label>
                    <input
                        type="text"
                        autoFocus
                        name="username"
                        placeholder="username"
                        value={inputs.username}
                        onChange={handleInputChange}
                    />
                    {renderErrMsg(errors, "username")}
                </div>
                <div className={"field " + hasErr(errors, "email")}>
                    <label htmlFor="email">E-Mail*:</label>
                    <input type="text" name="email" placeholder="email" value={inputs.email} onChange={handleInputChange} />
                    {renderErrMsg(errors, "email")}
                </div>
                <div className={"field " + hasErr(errors, "emailConfirm")}>
                    <label htmlFor="email">Confirm your e-mail*:</label>
                    <input type="text" name="emailConfirm" placeholder="Confirm your e-mail" value={inputs.emailConfirm} onChange={handleInputChange} />
                    {renderErrMsg(errors, "emailConfirm")}
                </div>
                <div className={"field " + hasErr(errors, "password")}>
                    <label htmlFor="password">Password*:</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="password"
                        value={inputs.password}
                        onChange={handleInputChange}
                    />
                    {renderErrMsg(errors, "password")}
                </div>
                <div className={"field " + hasErr(errors, "passwordConfirm")}>
                    <label htmlFor="passwordConfirm">Confirm your password*:</label>
                    <input
                        type="password"
                        name="passwordConfirm"
                        placeholder="Confirm your password"
                        value={inputs.passwordConfirm}
                        onChange={handleInputChange}
                    />
                    {renderErrMsg(errors, "passwordConfirm")}
                </div>
                <div className={"inline fields " + hasErr(errors, "gender")}>
                    <label htmlFor="gender">Gender*:</label>
                    <div className={"field " + hasErr(errors, "gender")}>
                        <div className="ui radio checkbox">
                            <input
                                type="radio"
                                name="gender"
                                checked={inputs.gender === "male"}
                                onChange={handleInputChange}
                                value="male"
                            />
                            <label>male</label>
                        </div>
                    </div>
                    <div className={"field " + hasErr(errors, "gender")}>
                        <div className="ui radio checkbox">
                            <input
                                type="radio"
                                name="gender"
                                checked={inputs.gender === "female"}
                                onChange={handleInputChange}
                                value="female"
                            />
                            <label>female</label>
                        </div>
                        {renderErrMsg(errors, "gender")}
                    </div>
                    <div className={"field " + hasErr(errors, "gender")}>
                        <div className="ui radio checkbox">
                            <input
                                type="radio"
                                name="gender"
                                checked={inputs.gender === "others"}
                                onChange={handleInputChange}
                                value="others"
                            />
                            <label>others</label>
                        </div>
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="Biography">Biography:</label>
                    <textarea
                        rows="5"
                        name="biography"
                        placeholder="Type something about yourself.."
                        value={inputs.biography}
                        onChange={handleInputChange}
                    />
                </div>
                <button className="ui button mini" type="submit">
                    Submit
                </button>
                <button className="ui button mini red" onClick={() => history.goBack()}>
                    Back
                </button>
            </form>
        </div>
    )
}

