import React, {useState} from 'react';
import {Row, Col, Divider, Modal} from 'antd';
import "../assets/styles/OrderCard.css";
import DefaultButton from "./DefaultButton.tsx";

interface CardProps {
    restaurant: string;
    status: string;
    date: string;
    items: any[];
}

function OrderCard({ restaurant, status, date, items }: CardProps) {
    const [detailState, setdetailState] = useState(false);
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
        <div className="order-card-container">
            <Row>
                <Col span={24} className="order-card-restaurant">
                    <h3>{restaurant}</h3>
                </Col>
                <Col span={24} className="order-status">
                    <span className={status === "Annulée" ? "status-annulee" : "status-other"}>{status}</span>
                </Col>
                <Col span={24} className="order-card-date">
                    <p>{date}</p>
                </Col>
            </Row>
            <Divider className="order-card-separator" />
            <Row className="order-card-items-container">
                {items.map((item, index) => (
                    <Col span={24} key={index} className="order-card-items">
                        {item.name} <span>x{item.quantity}</span>
                    </Col>
                ))}

            </Row>
            <Divider className="order-card-separator" />
            <Row gutter={16}>
                <Col  className="order-card-button" span={24}>
                    <DefaultButton text="Détails" textColor="FFF" marginRight="0.5" bgColor="298029" width={"8rem"} onClick={() => {
                        setdetailState(true);
                    }} />
                    <DefaultButton text="Aide" textColor="FFF" bgColor="FFA500" width={"8rem"} />

                </Col>
            </Row>
        </div>
        </>
    );
}

export default OrderCard;
