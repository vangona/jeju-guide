import { authService } from "fBase";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("")
    const onChange = (event) => {
        const {target: {name, value}} = event;
        if (name === "email") {
            setEmail(value)
        } else if (name === "password"){
            setPassword(value)
        }
    }
    const onSubmit = async (event) => {
        let data;
        event.preventDefault();
        try {
            if (newAccount) {
                data = await authService.createUserWithEmailAndPassword(
                    email, 
                    password
                );
            } else {
                data = await authService.signInWithEmailAndPassword(
                    email, 
                    password
                );
            }
        } catch (error) {
            if (error.message === "There is no user record corresponding to this identifier. The user may have been deleted.") {
                setError("입력하신 아이디가 없습니다.")
            } else {
                setError(error.message)
            }
        }

    }

    const toggleAccount = () => setNewAccount((prev) => !prev)
    return (
        <>
            <div className="auth-form__container">
                <form className="auth-form" onSubmit={onSubmit}>
                    <label className="auth-form__title">미슐탱 가이드</label>
                    <input className="input auth__input" name="email" type="email" placeholder="Email" required value={email} onChange={onChange}/>
                    <input className="input auth__input" name="password" type="password" placeholder="Password" required value={password} onChange={onChange}/>
                    <input className="btn" type="submit" value={newAccount ? "Create Account" : "Log In"} />
                    <span className="error">{error}</span>
                    <span className="change-btn" onClick={toggleAccount}>
                        <FontAwesomeIcon icon={faExchangeAlt} className="change-btn__logo" />
                        {newAccount? "Log In" : "Create Account"}
                    </span>
                </form>
            </div>
        </>
    )
}

export default Auth;