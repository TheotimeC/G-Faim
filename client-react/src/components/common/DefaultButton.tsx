import React from 'react';
import '../assets/styles/defaultButton.css';

interface DefaultButtonProps {
  text: string;
  textColor: string;
  bgColor: '298029' | 'FFA500' | 'FF3A44' | '9A9BA1';
  textSize: string;
  width: string;
  marginLeft: string;
  marginRight: string;
  onClick: () => void;
}

const DefaultButton: React.FC<DefaultButtonProps> = ({ text, textColor, textSize, bgColor,  width, marginLeft, marginRight,onClick}) => {
  const style = {
    color: `#${textColor}`,
    backgroundColor: `#${bgColor}`,
    fontSize: textSize,
    width: width,
    marginLeft: marginLeft,
    marginRight: marginRight,
  };

  return (
    <button className="default-button" style={style} onClick={onClick}>
      {text}
    </button>
  );
};

export default DefaultButton;