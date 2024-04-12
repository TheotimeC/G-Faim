import React, {useEffect, useState} from 'react';
import {Card, Col, Progress, Row} from 'antd';
import DefaultButton from './DefaultButton';
import '../assets/styles/CurrentOrderCard.css';
import {OrderStatus} from "../assets/order-api.ts";

interface CurrentOrderCardProps {
    restaurant: string;
    id: string;
    expectedDeliveryTime: string;
    status: string;
    image: string;
}

const CurrentOrderCard: React.FC<CurrentOrderCardProps> = ({ restaurant, id, expectedDeliveryTime, status, image }) => {
    const [detailState, setdetailState] = useState(false);
    const index: number = 20 * (Object.values(OrderStatus).indexOf(status) - 2);
    const [progressValue, setProgressValue] = useState(index);
    useEffect(() => {
        setProgressValue(index);
    }, [status]);
    return (
        <Card className="current-order-card custom-card">
            <Row>
                <Col span={8}>
                    <div className="current-order-header">
                        <h3>{restaurant}</h3>
                        <span>#{id.slice(0,3)}</span>
                        <span>{status}</span>
                    </div>
                </Col>
                <Col span={16} className="current-order-image-container">
                    <img
                        src={image}
                        alt={`${restaurant} order`}
                        className="current-order-image"
                    />
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Progress percent={progressValue} showInfo={false} className="current-order-progress" status={"active"} strokeColor={"green"} />
                </Col>
            </Row>
            <Row>
                <Col span={24} className="current-order-footer">
                    <div className="footer-content">
                    <p className="delivery-time">Livraison estimée: {expectedDeliveryTime}</p>
                    <DefaultButton text="Détails" textColor="FFF" bgColor="298029" width="9rem" height="2.5rem" onClick={() => {setdetailState(true)}}/>
                    </div>
                </Col>
            </Row>
        </Card>
    );
};

export default CurrentOrderCard;
