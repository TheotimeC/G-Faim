import OrderCard from "../common/OrderCard.tsx";
import "../assets/styles/Commandes.css"
import React, {useEffect, useState} from 'react';
import {Col, Row, notification} from 'antd';
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
        const restaurantInfo = (await restaurantApi.getRestaurantNameById(order.restaurantId)).data;
        return { ...order, restaurantName: restaurantInfo.Nom, restaurantImage: restaurantInfo.image };
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

const ws = new WebSocket('ws://localhost:8080');

function wsHandling(currentOrders: any, setCurrentOrders: any){
    // Connexion au serveur WebSocket
    ws.onmessage = (event) => {
        try {
                const { orderId, orderStatus } = JSON.parse(event.data);
                console.log("kafka order message: ", event)
                // Update the order status in currentOrders
                const updatedCurrentOrders: any[] = currentOrders.map((order: any) => {
                    if (order._id === orderId) {
                        return { ...order, status: orderStatus }; // Return a new object with the updated status
                    }
                    return order; // Return the original order if not the one to update
                });
                setCurrentOrders(updatedCurrentOrders);
                notification.success({
                    message: 'Votre commande à changé de statut',
                    description: `Votre commande est actuellement : ${orderStatus}`,
                    placement: 'top',
                    duration: 4.5,
                  });
        } catch (error) {
        }
    };
}
export default function Commandes() {
    const [currentOrders, setCurrentOrders] = useState<any[]>([]);
    const [pastOrders, setPastOrders] = useState<any[]>([]);
    wsHandling(currentOrders, setCurrentOrders);
    useEffect(() => {
        fetchData();
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
                            <CurrentOrderCard restaurant={order.restaurantName} id={order._id}
                                              expectedDeliveryTime={"12:00"} status={order.status}
                                              image={order.restaurantImage} items={order.items} />
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