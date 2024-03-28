import React from 'react';
import '../assets/styles/button.css';

interface ButtonProps {
  text: string;
  color: 'FFA500' | '298029';
  size: string;
}

const Button: React.FC<ButtonProps> = ({ text, color, size }) => {
  const style = {
    backgroundColor: `#${color}`,
    width: `${size}%`,
  };

  return (
    <button className="button" style={style}>
      {text}
    </button>
  );
};

export default Button;