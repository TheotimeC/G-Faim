import OrderCard from "../common/OrderCard.tsx";
import "../assets/styles/Commandes.css"
import React, {useEffect, useState} from 'react';
import {Col, Row} from 'antd';
import CurrentOrderCard from "../common/CurrentOrderCard.tsx";
import restaurantApi from "../assets/restaurant-api.ts";
import OrderApi, {OrderStatus} from "../assets/order-api.ts";
import {getUserId} from "../assets/user-api.ts";

const userId = await getUserId();
async function getOrdersWithRestaurantNames() {
    if (!userId)
        return null;
    // Step 1: Retrieve all orders for the user
    const response = await OrderApi.getOrdersByUserId(userId);
    const allOrders = response.data
    if (allOrders.length === 0)
        return {currentOrders: [], pastOrders: []};
    // Step 2 & 3: For each order, retrieve the restaurant name and augment the order object
    const augmentedOrdersPromises = allOrders.map(async (order: any) => {
        const restaurantName = (await restaurantApi.getRestaurantNameById(order.restaurantId)).data;
        return { ...order, restaurantName};
    });
    const augmentedOrders =  await Promise.all(augmentedOrdersPromises);

    // Splitting orders into current and past based on their status
    const currentOrders = augmentedOrders.filter(order =>
        order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.CART
    );
    const pastOrders = augmentedOrders.filter(order =>
        order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED
    );

    return { currentOrders, pastOrders };
}


console.log("ALL ORDERS: ", await getOrdersWithRestaurantNames())
export default function Commandes() {
    const [currentOrders, setCurrentOrders] = useState([]);
    const [pastOrders, setPastOrders] = useState([]);
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
      // Connexion au serveur WebSocket
      const ws = new WebSocket('ws://localhost:42402');
  
      ws.onmessage = (event) => {
        // Lors de la réception d'un message, mettez à jour l'état avec le nouveau message
        
        const message = event.data;
        console.log("Nouveau message WebSocket reçu:", message);
        setMessages(prevMessages => [...prevMessages, message]);
      };
      
  
      return () => {
        if (ws.readyState === 1) { // <-- This is important
          ws.close();
        }
    }
    }, []);

    useEffect(() => {
        async function fetchData() {

        const {currentOrders, pastOrders} = await getOrdersWithRestaurantNames();
        // @ts-ignore
        setCurrentOrders(currentOrders ? currentOrders : []);
        // @ts-ignore
        setPastOrders(pastOrders ? pastOrders : []);
        }
        fetchData();
    }, []);

            return (
            <>
                <div className="current-orders">
                <h1 className="orders-title">Commandes en cours</h1>
                <Row gutter={[16, 16]} className="">
                    {currentOrders.map((order: any, index) => (
                        <Col key={index} xs={24} sm={12} md={8} lg={8}>
                            <CurrentOrderCard restaurant={order.restaurantName} id={order._id} expectedDeliveryTime={"12h"} />
                        </Col>
                    ))}
                </Row>
                </div>
                <div className="order-history">
                <h1 className="orders-title">Commandes passées</h1>
                <Row gutter={[16, 16]}>
                    {pastOrders.map((order: any, index) => (
                        <Col key={index} xs={24} sm={12} md={8} lg={8}>
                            <OrderCard restaurant={order.restaurantName} status={order.status} date={order.deliveryDate} items={order.items} />
                        </Col>
                    ))}
                </Row>
                </div>
            </>
    )
}