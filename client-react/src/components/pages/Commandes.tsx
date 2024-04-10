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
        return { currentOrders: [], pastOrders: [] }
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

export default function Commandes() {
    const [currentOrders, setCurrentOrders] = useState<any[]>([]);
    const [pastOrders, setPastOrders] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
        const ws = new WebSocket('ws://localhost:29286');
        // Connexion au serveur WebSocket

        ws.onmessage = (event) => {
            console.log(event.data);
            try {
                const message = JSON.parse(event.data);
                console.log("kafka message: ", message);
                if (message.key === 'orderUpdate') {
                    const { orderId, orderStatus } = JSON.parse(message.value);

                    // Update the order status in currentOrders
                    const updatedCurrentOrders: any[] = currentOrders.map((order: any) => {
                        if (order._id === orderId) {
                            return { ...order, status: orderStatus }; // Return a new object with the updated status
                        }
                        return order; // Return the original order if not the one to update
                    });
                    console.log("updating order because of WS: ", updatedCurrentOrders);
                    setCurrentOrders(updatedCurrentOrders);
                }
            } catch (error) {
                console.error('Error parsing message from WebSocket', error);
            }
        };

        return () => {
            if (ws.readyState === 1) ws.close();
        }
        async function fetchData() {

        const {currentOrders, pastOrders} = await getOrdersWithRestaurantNames();
        // @ts-ignore
        setCurrentOrders(currentOrders ? currentOrders : []);
        // @ts-ignore
        setPastOrders(pastOrders ? pastOrders : []);
        }
    }, []);

            return (
            <>
                <div className="current-orders">
                <h1 className="orders-title">Commandes en cours</h1>
                <Row gutter={[16, 16]} className="">
                    {currentOrders.map((order: any, index) => (
                        <Col key={index} xs={24} sm={12} md={8} lg={8}>
                            <CurrentOrderCard restaurant={order.restaurantName} id={order._id} expectedDeliveryTime={"12:00"} status={order.status} />
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