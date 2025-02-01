import { createContext,useContext } from "react";


export const ExpenceContext=createContext({
    // todos:[
    //     {
    //         id:1,
    //         todo:"todo msg",
    //         completed:false
    //     }
    // ],
    addExpence:(expence)=>{},
    
    removeExpence:(id)=>{},
    
});


export const ExpenceProvider=ExpenceContext.Provider;

export  const useExpence=()=>{
    return useContext(ExpenceContext);
}