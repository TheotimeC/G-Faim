import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';
import '../assets/styles/livaccueil.css';
import Logo from '../assets/images/logo.png';
import LivTableau from '../common/LivTableau';



const Liv_History: React.FC = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleActiveStatus = () => {
    setIsActive(!isActive);
  };



  const deliveries = [
    { key: '1', client: 'Ludovic', restaurant: 'Burger Queen', addressResto: '5 rue des roses', numResto:'0388762541', distance: '2,6 km', price: '6.50€', addressClient:'2 rue doigby', numClient: '0708552253' },
    { key: '2', client: 'Thomas', restaurant: 'Burger Queen', addressResto: '5 rue des roses', numResto:'0388762541', distance: '2,6 km', price: '6.50€', addressClient:'2 rue doigby', numClient: '0708552253' },
    { key: '3', client: 'Tim', restaurant: 'Mcdo', addressResto: '5 rue des roses', numResto:'0388762541', distance: '9,6 km', price: '10.90€', addressClient:'2 rue doigby', numClient: '0708552253' },
  ];

  

  return (
    <div className='liv-accueil'>
      <div className="liv-accueil-container">
        <div className="logo-section">
          <img src={Logo} className="logo" alt='logo' />
        </div>
        <div className="livreur-info-section">
          <div className="livreur-name">
            <h2>Aycan</h2>
          </div>
          <div className='liv-btn'>
            <Button
              type={isActive ? 'primary' : 'default'}
              icon={<PoweroffOutlined />}
              onClick={toggleActiveStatus}
              className='liv-accueil-button'>
              {isActive ? 'Actif' : 'Inactif'}
            </Button>
          </div>
        </div>
      </div>
      <div className="delivery-title-container">
          <h3>Historiques des livraisons</h3>
      </div>
      <div>
        <LivTableau deliveries={deliveries} showIcon={false}/>
      </div>
    </div>
  );
};

export default Liv_History;