import React from 'react'
import "./startscreen.css";


function StartScreen({onStart}) {
    return (
        <div className="sscreen-wrapper">
           
            <div className="ss-info">
               <div className="tagline">
                    type form clone- open sourced because of client didn't paid for this;
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
