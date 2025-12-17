import { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";

const AuthPage = ({setDetails}) => {
    const [auth, setAuth] = useState("Login");

    const authChange = () => {
        setAuth(auth === "Login" ? "Register" : "Login");
    }

    return (
        <>
        {auth === "Login" && <Login authChange = {authChange} setDetails={setDetails}/> }
        {auth === "Register" && <Signup authChange = {authChange} setDetails={setDetails}/> }
        </>
    )
}

export default AuthPage;