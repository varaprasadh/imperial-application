import React from 'react'
import "./startscreen.css";
import hero_image from "../../../icons/hero_start.jpeg";


function StartScreen({onStart}) {
    return (
        <div className="sscreen-wrapper">
           <div className="hero">
               <img src={hero_image} alt="hero image"/>
           </div>
            <div className="ss-info">
               <div className="tagline">
                   Welcome to a new world of possibilities. Open a personal bank account online in quick and easy steps with zero paperwork. 
With Imperial Capital, It Can Be
               </div>
            </div>
            <div className="ss-actions">
                <div className="ss-action start" onClick={onStart}>
                   <div className="ss-action-content">Lets Start</div>
                </div>
            </div>
        </div>
    )
}

export default StartScreen
