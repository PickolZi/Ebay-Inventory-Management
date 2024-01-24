'use client'
import { createContext } from "react";
import { useState } from "react";

export const UserAuthContext = createContext({
    userAuth: null,
    setUserAuth: () => {}
});

export const UserAuthProvider = ({children}) => {
    const [userAuth, setUserAuth] = useState("");
    const value = {userAuth, setUserAuth}

    return (
        <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>
    )
}