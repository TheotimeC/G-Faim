import React from 'react';
import '../assets/styles/button.css';

interface ButtonProps {
  text: string;
  color: 'FFA500' | '298029';
  size: string;
  onClick: () => void;
  className?: string
}

const Button: React.FC<ButtonProps> = ({ text, color, size, onClick, className}) => {
  const style = {
    backgroundColor: `#${color}`,
    width: `${size}%`,
  };

  return (
    <button className={`button ${className}`} style={style} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;