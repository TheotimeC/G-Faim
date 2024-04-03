// Card.tsx
import React from 'react';
import '../assets/styles/restocard.css'; 

type RestoCardProps = {
  nom: string;
  description: string;
  prix: number;
  img: string; 
  onClick: () => void;
};

const RestoCard: React.FC<RestoCardProps> = ({ nom, description, prix, img, onClick  }) => {
  return (
    <div className="resto-card" onClick={onClick}>
      <div className="resto-card-content">
        
        <div className="resto-card-text">
          <h3 className="resto-card-title">{nom}</h3>
          <p className="resto-card-subtitle">{description}</p>
          <p className="resto-card-subtitle">{prix}€</p>
        </div>
        <img src={img} alt={`${nom}`} className="resto-card-image" />
      </div>
      
    </div>
  );
};

export default RestoCard;
