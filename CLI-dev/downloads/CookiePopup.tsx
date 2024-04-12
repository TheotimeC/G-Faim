import React from 'react';
import DefaultButton from './DefaultButton'; 
import '../assets/styles/cookie.css'; 
import Cookie from '../assets/images/cookie.png';

interface CookiePopupProps {
    onAccept: () => void;
    onRefuse: () => void;
  }

const CookiePopup: React.FC<CookiePopupProps> = ({ onAccept, onRefuse }) => {
  return (
    <div className="cookie-popup">
      <div className="cookie-content">
        <img src={Cookie} alt="Cookie" className="cookie-image" />
        <div className="cookie-wording">
            <h2 className="cookie-title">Comment leur résister ?</h2>
            <p className="cookie-text">
            Les cookies sont là ! Pas ceux qu'on mange, malheureusement, mais ceux qui
            rendent votre visite sur notre site plus savoureuse. En cliquant sur "Accepter",
            vous dites oui à une expérience optimisée. Si vous refusez, c'est comme laisser
            refroidir le café du matin.
            </p>
        </div>
    </div>
    <div className="cookie-buttons">
        <DefaultButton text="Refuser" textColor="FFFFFF" textSize="1rem" bgColor="FF3A44" width="100px" marginLeft="10px" marginRight="10px" onClick={onRefuse} />
        <DefaultButton text="Accepter" textColor="FFFFFF" textSize="1rem" bgColor="298029" width="100px" marginLeft="10px" marginRight="10px"onClick={onAccept} />
    </div>
      
    </div>
  );
};

export default CookiePopup;