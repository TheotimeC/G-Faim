import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { mdiMapMarker } from '@mdi/js';
import Icon from '@mdi/react';
import '../assets/styles/livdetailcommande.css';

// Les props attendues par le composant de la pop-up
interface LivDetailCommandeProps {
  visible: boolean; // pour contrôler la visibilité de la pop-up
  onClose: () => void; // pour fermer la pop-up
  delivery: DeliveryItem | null; // pour afficher les détails de la commande
  onAccept?: () => void;
}

// Le type pour les détails de la commande, adapté à votre application
interface DeliveryItem {
  client: string;
  restaurant: string;
  distance: string;
  price: string;
  addressClient: string;
  addressResto: string;
  numResto: string;
  numClient: string;
}

const LivDetailCommande: React.FC<LivDetailCommandeProps> = ({ visible, onClose, delivery }) => {

  const [accepted, setAccepted] = useState(false);

  // Appelée lorsque le livreur accepte la commande
  const handleAccept = () => {
    setAccepted(true);
  };

  // Appelée pour envoyer un message (à définir)
  const handleMessage = () => {
    // Logique pour envoyer un message
  };

  if (!delivery) {
    return null; 
  }

  const footerButtons = accepted ? [
    <Button className='liv-btn-cancel' key="cancel" onClick={onClose}>Annuler</Button>,
    <Button className='liv-btn-message' key="message" onClick={handleMessage}>Message</Button>,
    <Button className='liv-btn-deliver' key="delivered" type="primary" onClick={onClose}>Livrée</Button>,
  ] : [
    <Button className='liv-btn-refuse' key="close" onClick={onClose}>Fermer</Button>,
    <Button className='liv-btn-accept' key="accept" type="primary" onClick={handleAccept}>Accepter</Button>,
  ];

  return (
    <Modal
      visible={visible}
      onOk={onClose}
      onCancel={onClose}
      footer={footerButtons}
    >
      <div className="delivery-details">
        <div className="liv-tableau-detail">
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Restaurant</th>
              <th>Distance</th>
              <th>Prix</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
              <tr>
                <td>{delivery.client}</td>
                <td>{delivery.restaurant}</td>
                <td>{delivery.distance}</td>
                <td>{delivery.price}</td>
              </tr>
          </tbody>
        </table>
      </div>
        <h3>Restaurant</h3>
        <p>{delivery.restaurant}</p>
        <p>{delivery.addressResto}</p>
        <p>{delivery.numResto}</p>

        <h3>Client</h3>
        <p>{delivery.client}</p>
        <p>{delivery.addressClient}</p>
        <p>{delivery.numClient}</p>

        {/* Inclure une carte si nécessaire */}
        <div className="delivery-map">
          {/* Placeholder pour la carte, remplacer par votre composant de carte */}
          <Icon path={mdiMapMarker} size={2} />
        </div>
      </div>
    </Modal>
  );
};

export default LivDetailCommande;