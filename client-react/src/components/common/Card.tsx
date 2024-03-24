// Card.tsx
import React from 'react';
import '../assets/styles/card.css'; 

type CardProps = {
  title: string;
  subtitle: string;
  img: string; 
};

const Card: React.FC<CardProps> = ({ title, subtitle, img }) => {
  return (
    <div className="card">
      <div className="card-content">
        <img src={img} alt={`${title} image`} className="card-image" />
        <div className="card-text">
          <h3 className="card-title">{title}</h3>
          <p className="card-subtitle">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
