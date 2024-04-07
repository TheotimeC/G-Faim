import React, { useState, useEffect } from 'react';
import '../assets/styles/input.css';
import Icon from '@mdi/react';
import { mdiPencilOutline, mdiCheck } from '@mdi/js';


interface ButtonProps {
  titre:string;  
  text: string;
  placeholder:string;
  size: string;
  margintop:string;
  onChange: (newValue: string) => void;
}

const Input: React.FC<ButtonProps> = ({ titre, text, placeholder, size, margintop, onChange  }) => {
    const [isEditable, setIsEditable] = useState(false); 
    const [inputValue, setInputValue] = useState(text);
    const [inputStyle, setInputStyle] = useState({});

    useEffect(() => {
      setInputValue(text);
    }, [text]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        onChange(e.target.value);
      };
    
      // Active l'édition de l'input
      const handleEditClick = () => {
        if(isEditable==true){
            setIsEditable(false);
            setInputStyle({});
        }else{
            setIsEditable(true);
            setInputStyle({
                border: '2px solid #03081F',
              });
        }
        
      };

      const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') { // Utilisez 'key' au lieu de 'keyCode'
          setIsEditable(false); // Désactive l'édition
          setInputStyle({});
        }
      };
  const style = {
    width: `${size}%`,
    ...inputStyle,
  };
  const contain = {
    marginTop:`${margintop}%`
  }

  return (
    <div className='inputcontainer' style={contain}>
    <span className='titre'>{titre}</span>
    <div className='inputglobal'>
    <input style={style} onKeyDown={handleKeyDown} value={inputValue} onChange={handleChange} disabled={!isEditable}></input>
    <a onClick={handleEditClick} className='icon'><Icon path={isEditable ? mdiCheck : mdiPencilOutline} size={1} color={"#03081F"}/></a>
    </div>
    </div>
  );
};

export default Input;