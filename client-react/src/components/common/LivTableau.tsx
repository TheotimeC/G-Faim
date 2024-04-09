import React from 'react';
import '../assets/styles/livtableau.css';
import Icon from '@mdi/react';
import { mdiEye } from '@mdi/js';

interface DeliveryItem {
  key: React.Key;
  client: string;
  restaurant: string;
  distance: string;
  price: string;
}

interface LivTableauProps {
  deliveries: DeliveryItem[];
  onViewDetails: (key: React.Key) => void;
}

const LivTableau: React.FC<LivTableauProps> = ({ deliveries, onViewDetails }) => {
  return (
    <div className="liv-tableau">
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
          {deliveries.map((delivery) => (
            <tr key={delivery.key}>
              <td>{delivery.client}</td>
              <td>{delivery.restaurant}</td>
              <td>{delivery.distance}</td>
              <td>{delivery.price}</td>
              <td>
                <Icon 
                    path={mdiEye} 
                    size={1} 
                    className="table-eye-icon" 
                    onClick={() => onViewDetails(delivery.key)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LivTableau;