import React, { ReactElement, useState } from 'react';
import { Col, Row } from 'antd';
import '../assets/styles/cardDisplay.css'

interface CategoriesDisplayProps<T> {
    title: string;
    data: T[];
    renderItem: (item: T) => ReactElement; 
  }

  const CategoriesDisplay = <T,>({ title, data, renderItem }: CategoriesDisplayProps<T>) => {  
  const initialVisibleCards = 5; //Nb de cartes par ligne
  const [visibleCards, setVisibleCards] = useState(initialVisibleCards);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleCardsVisibility = () => {
    setVisibleCards(isExpanded ? initialVisibleCards : data.length);
    setIsExpanded(!isExpanded);
  };

  return (
    <div className='Cate-pop'>
      <Row className='Row1'>
        <Col span={8} className='Col1'><p className='Titre'>{title}</p></Col>
        <Col span={8} className='Col2'></Col>
        <Col span={8} className='Col3'>
          <a className='Sous-titre' onClick={toggleCardsVisibility}>
            {isExpanded ? 'Voir moins' : 'Voir plus'}
          </a>
        </Col>
      </Row>

      <Row className='Row2'>
        <Col span={16} offset={4} className='Col2-2'>
          <div className='carcontainer'>
            {data.slice(0, visibleCards).map((item, index) => renderItem(item))}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CategoriesDisplay;
