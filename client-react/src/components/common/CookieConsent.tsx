import React, { useState } from 'react';
import CookiePopup from './CookiePopup';
import '../assets/styles/cookie.css'; 

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleAcceptCookies = () => {
    // Logique pour accepter les cookies
    setIsVisible(false);
    localStorage.setItem('cookieConsent', 'accepted');
  };

  const handleRefuseCookies = () => {
    // Logique pour refuser les cookies
    setIsVisible(false);
    localStorage.setItem('cookieConsent', 'refused');
  };

  /*if (!isVisible) {
    return null;
  }*/

  // Ne pas afficher la pop-up si le consentement a déjà été donné ou refusé
  const consent = localStorage.getItem('cookieConsent');
  if (consent) {
    return null;
  }

  return (
    <div className={`cookie-consent ${isVisible ? '' : 'hidden'}`}>
      <CookiePopup onAccept={handleAcceptCookies} onRefuse={handleRefuseCookies} />
    </div>
  );
};

export default CookieConsent;