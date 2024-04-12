import React, {useEffect, useState} from 'react';
import {Card, Col, Modal, Progress, Row} from 'antd';
import DefaultButton from './DefaultButton';
import '../assets/styles/CurrentOrderCard.css';
import {OrderStatus} from "../assets/order-api.ts";

interface CurrentOrderCardProps {
    restaurant: string;
    id: string;
    expectedDeliveryTime: string;
    status: string;
    image: string;
    items: any[];
}

const CurrentOrderCard: React.FC<CurrentOrderCardProps> = ({ restaurant, id, expectedDeliveryTime, status, image, items }) => {
    const [detailState, setdetailState] = useState(false);
    const index: number = 20 * (Object.values(OrderStatus).indexOf(status) - 2);
    const [progressValue, setProgressValue] = useState(index);
    useEffect(() => {
        setProgressValue(index);
    }, [status]);
    const handleOk = () => {
        setdetailState(false);
    };

    const handleCancel = () => {
        setdetailState(false);
    };
    return (
        <>
            <Modal
                open={detailState}
                onOk={handleOk}
                onCancel={handleCancel}
                width={800}
            >
                {items.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <div className="frame-wrapper19">
                            {items.map((item, index) => (
                                <div key={item.itemId} className="frame-parent48">
                                    <div className="parent6">
                                        <b className="b21">{`${item.price} €`}</b>
                                        <div className="menu-maxi-best-of-parent">
                                            <b className="menu-maxi-best-of2">{item.name}</b>
                                            <b className="b22">{item.quantity}</b>
                                        </div>
                                    </div>
                                    {index < items.length - 1 && (
                                        <div className="line-wrapper8">
                                            <div className="frame-child63" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div className="line-wrapper8">
                                <div className="frame-child63" />
                            </div>
                            <div className="prix-total-parent">
                                <b className="prix-total1">Prix Total : </b>
                                {/* Calculate and show the total price. Replace the calculation as necessary. */}
                                <b className="b27">{`${items.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)} €`}</b>
                            </div>
                        </div>

                        <div className="frame-parent50">
                            <div className="client-parent">
                                <b className="client1">Client</b>
                                <b className="barnab1">{/* Display the client name here */}</b>
                            </div>
                            <div className="livreur-parent">
                                <b className="livreur1">Livreur</b>
                                <b className="samy3">{/* Display the delivery person name here, if applicable */}</b>
                            </div>
                            <div className="statut-parent">
                                <b className="statut1">Statut:</b>
                                <b className="a-accepter1" style={{marginBottom: 50}}>{status}</b>
                            </div>
                            <div className="frame-wrapper20">
                                <div className="rectangle-parent233">
                                    <div className="frame-child65" />
                                    <b className="demande">Demande :</b>
                                    <div className="sans-tomates-chef">
                                        {/* If there's a special request or note for the order, display it here. */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

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
        </>
    );
};

export default CurrentOrderCard;
