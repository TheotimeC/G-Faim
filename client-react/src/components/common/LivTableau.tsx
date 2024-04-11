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
  onViewDetails?: (delivery: DeliveryItem) => void;
  showIcon?: boolean;
}




const LivTableau: React.FC<LivTableauProps> = ({ deliveries, onViewDetails, showIcon = true}) => {
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
              {showIcon && (
                <div className="liv-eye-icon" onClick={() => onViewDetails?.(delivery)}>
                <Icon path={mdiEye} size={1} />
                </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default LivTableau;
