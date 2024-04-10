import React from 'react';
import { Row, Col, Divider } from 'antd';
import "../assets/styles/OrderCard.css";
import DefaultButton from "./DefaultButton.tsx";

interface CardProps {
    restaurant: string;
    status: string;
    date: string;
    items: { name: string; quantity: number }[];
}

function OrderCard({ restaurant, status, date, items }: CardProps) {
    return (
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
                    <DefaultButton text="Détails" textColor="FFF" marginRight="0.5" bgColor="298029" width={"8rem"} />
                    <DefaultButton text="Aide" textColor="FFF" bgColor="FFA500" width={"8rem"} />

                </Col>
            </Row>
        </div>
    );
}

export default OrderCard;
