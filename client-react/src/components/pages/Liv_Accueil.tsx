import React, { useState } from 'react';
import { Button } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';
import '../assets/styles/livaccueil.css';
import Logo from '../assets/images/logo.png';

const Liv_Accueil: React.FC = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleActiveStatus = () => {
    setIsActive(!isActive);
  };
  

  return (
    <div>
      <div className="liv-accueil-container">
      <div className="logo-section">
        <img src={Logo} className="logo" alt='logo' />
      </div>
      <div className="livreur-info-section">
        <div className="livreur-name">
          <h2>Aycan</h2>
        </div>
        <Button
          type={isActive ? 'primary' : 'default'}
          icon={<PoweroffOutlined />}
          onClick={toggleActiveStatus}
          className='liv-accueil-button'>
          {isActive ? 'Actif' : 'Inactif'}
        </Button>
      </div>
      </div>
      <div className="delivery-title-container">
          <h3>Livraisons autour de moi</h3>
        </div>
    </div>
    
    
  );
};

export default Liv_Accueil;