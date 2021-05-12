import React, {  createContext, useState } from "react";



export const AuthContext = createContext()


export const AuthContextProvider = ({children}) => {

    const [isLogin , setIsLogin] = useState(false)
    const [user, setUser] = useState(null);

    const Login = (user)=> {
        setIsLogin(true)
        setUser(user)

    }

    const Logout = () => {
        setIsLogin(false)
    } 
    return (
        <AuthContext.Provider value={{ isLogin , Login , Logout , user}}>
          {children}
        </AuthContext.Provider>
      );
}