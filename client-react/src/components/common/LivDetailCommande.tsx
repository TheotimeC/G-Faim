import React from 'react';
import { Modal, Button } from 'antd';
import { mdiMapMarker } from '@mdi/js';
import Icon from '@mdi/react';

// Les props attendues par le composant de la pop-up
interface LivDetailCommandeProps {
  visible: boolean; // pour contrôler la visibilité de la pop-up
  onClose: () => void; // pour fermer la pop-up
  delivery: DeliveryItem | null; // pour afficher les détails de la commande
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
  if (!delivery) {
    return null; // ou un spinner/loading indicator tant que delivery est null
  }

  return (
    <Modal
      title="Détails de la commande"
      visible={visible}
      onOk={onClose}
      onCancel={onClose}
      footer={[
        <Button key="refuse" onClick={onClose}>Refuser</Button>,
        <Button key="accept" type="primary" onClick={onClose}>Accepter</Button>,
      ]}
    >
      <div className="delivery-details">
        <h3>Restaurant</h3>
        <p>{delivery.restaurant}</p>
        <p>{delivery.addressResto}</p>
        <p>{delivery.numResto}</p>

        <h3>Adresse Client</h3>
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