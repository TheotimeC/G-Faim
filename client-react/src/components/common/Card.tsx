// Card.tsx
import React from 'react';
import '../assets/styles/card.css'; 

type CardProps = {
  title: string;
  subtitle: string;
  img: string; 
  onClick: () => void;
};

const Card: React.FC<CardProps> = ({ title, subtitle, img, onClick  }) => {
  return (
    <div className="card" onClick={onClick}>
      <div className="card-content">
        <img src={img} alt={`${title}`} className="card-image" />
        <div className="card-text">
          <h3 className="card-title">{title}</h3>
          <p className="card-subtitle">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
