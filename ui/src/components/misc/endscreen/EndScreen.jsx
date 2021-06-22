import React from 'react'
import "./endscreen.css";
import hero_image from "../../../icons/hero_end.jpeg";
function EndScreen() {
    return (
        <div className="escreen-wrapper">
            <div className="hero">
                <img src={hero_image} alt="hero image"/>
            </div>
            <div className="note">
                <div className="line-bold">
                    Note:
                </div>
                <div className="info">
                    <div className="note-line">
                        1. All submitted documents will be verified with the issuing authority for authenticity prior to account validation.
                    </div>
                    <div className="note-line">
                        2. Feedback is given within 72 working hours after receipt of your documents. 
                    </div>
                </div>
            </div>
            <div className="es-contact">
                <div className="line-bold">
                    For any assistance, please contact our Customer service team 24/7 on the numbers as shown below. 
                </div>
                <div className="es-contact-info">
International Business Clients Desk <br/>
International: +380 94 71 03402 Ext. 1<br/>
Toll-Free 0 800 50 4679 <br/>
Fax: +380 44 233 3030
                </div>
                <div className="es-contact-adr">
                    Imperial capital Bank Ukraine JSC JSC <br/>
Imperial Capital Ukraine (Podil Plaza Business Center) str. <br/>
Spaska, 30-A 04070 Kiev Ukraine
                </div>
            </div>
            <div className="ss-info">
                <div className="e-actions">
                    <div className="e-action start">
                        <div className="action-content">Thank You!</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EndScreen;
