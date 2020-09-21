import React from "react";
import "./fullscreen.css";


function Fullscreen({children}) {
    return (
        <div className="fullscreen">
           <div className="fs-wrap">
               {children}
           </div> 
        </div> 
    )
}
export default Fullscreen;

