import React, {  createContext, useState } from "react";



export const AuthContext = createContext()


export const AuthContextProvider = ({children}) => {

    const [isLogin , setIsLogin] = useState(false)

    const Login = ()=> {
        setIsLogin(true)
    }

    const Logout = () => {
        setIsLogin(false)
    } 
    return (
        <AuthContext.Provider value={{ isLogin , Login , Logout}}>
          {children}
        </AuthContext.Provider>
      );
}