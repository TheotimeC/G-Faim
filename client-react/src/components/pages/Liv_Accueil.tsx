import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';
import '../assets/styles/livaccueil.css';
import Logo from '../assets/images/logo.png';
import LivTableau from '../common/LivTableau';



const Liv_Accueil: React.FC = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleActiveStatus = () => {
    setIsActive(!isActive);
  };

  const deliveries = [
    { key: '1', client: 'Ludovic', restaurant: 'Burger Queen', distance: '2,6 km', price: '6.50€' },
    { key: '2', client: 'Thomas', restaurant: 'Burger Queen', distance: '2,6 km', price: '6.50€' },
    { key: '3', client: 'Tim', restaurant: 'Mcdo', distance: '9,6 km', price: '10.90€' },
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const showModal = (delivery) => {
    setSelectedDelivery(delivery);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };


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
          <h3>Livraisons autour de moi</h3>
      </div>
      <Modal title="Détails de la commande" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        {/* Vous pouvez placer ici le contenu de votre Modal, par exemple le composant LivTableau */}
        {selectedDelivery && (
          <div>
            <LivTableau deliveries={deliveries} onViewDetails={showModal }/>
          </div>
        )}
      </Modal>
      <div>
        <LivTableau deliveries={deliveries} onViewDetails={showModal }/>
      </div>
    </div>
  );
};

export default Liv_Accueil;