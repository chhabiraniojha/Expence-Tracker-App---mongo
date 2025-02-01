import { createContext,useContext } from "react";


export const LoginContext=createContext({
    user:
        {
            id:1,
            name:'suvransu',
            email:'chhabiraniojha@gmail.com',
            isPremium:false,
            isLoggedIn:false
        }
    ,
    Login:()=>{},
    
    Logout:()=>{},
    
});


export const LoginProvider=LoginContext.Provider;

export  const useLogin=()=>{
    return useContext(LoginContext);
}