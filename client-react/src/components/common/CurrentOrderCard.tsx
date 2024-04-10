import React from 'react';
import {Card, Col, Progress, Row} from 'antd';
import DefaultButton from './DefaultButton';
import '../assets/styles/CurrentOrderCard.css';

interface CurrentOrderCardProps {
    restaurant: string;
    id: string;
    expectedDeliveryTime: string;
}

const CurrentOrderCard: React.FC<CurrentOrderCardProps> = ({ restaurant, id, expectedDeliveryTime }) => {
    return (
        <Card className="current-order-card custom-card">
            <Row>
                <Col span={8}>
                    <div className="current-order-header">
                        <h3>{restaurant}</h3>
                        <span>#{id}</span>
                    </div>
                </Col>
                <Col span={16} className="current-order-image-container">
                    <img
                        src="https://static.actu.fr/uploads/2023/09/mcdonald-s-frites-arnaque-960x640.jpeg"
                        alt={`${restaurant} order`}
                        className="current-order-image"
                    />
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Progress percent={50} showInfo={false} className="current-order-progress" status={"active"} strokeColor={"green"} />
                </Col>
            </Row>
            <Row>
                <Col span={24} className="current-order-footer">
                    <div className="footer-content">
                    <p className="delivery-time">Livraison estimée: {expectedDeliveryTime}</p>
                    <DefaultButton text="Details" textColor="FFF" bgColor="298029" width="9rem" height="2.5rem" />
                    </div>
                </Col>
            </Row>
        </Card>
    );
};

export default CurrentOrderCard;
