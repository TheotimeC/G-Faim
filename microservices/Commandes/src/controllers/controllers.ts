import {FastifyReply} from "fastify";

import { KafkaConfig } from "../Kafka/config-kafka";
// Import the Order model
import Order from "../models/models";

// Type definition for request with body
export const createOrder = async (request: any, reply: any) => {
    try {
        const newOrder = new Order(request.body);
        const savedOrder = await newOrder.save();
        reply.code(201).send(savedOrder);
    } catch (error) {
        reply.code(500).send(error);
    }
};

// Get all orders
export const getAllOrders = async (request: any, reply: any) => {
    try {
        const orders = await Order.find({});
        reply.code(200).send(orders);
    } catch (error) {
        reply.code(500).send(error);
    }
};

// Get a single order by ID
export const getOrderById = async (request: any, reply: any) => {
    try {
        const order = await Order.findById(request.params.id);
        if (!order) {
            reply.code(404).send({ message: 'Order not found' });
            return;
        }
        reply.code(200).send(order);
    } catch (error) {
        reply.code(500).send(error);
    }
};
export const getOrderByUserId = async (request: any, reply: any) => {
    try {
        const order = await Order.findOne({ userId: request.query.userId });
        if (!order) {
            reply.code(404).send({ message: 'Order not found' });
            return;
        }
        reply.code(200).send(order);
    } catch (error) {
        reply.code(500).send(error);
    }
};

// Update an order by ID
export const updateOrderById = async (request: any  , reply: any) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(request.params.id, request.body, { new: true });
        if (!updatedOrder) {
            reply.code(404).send({ message: 'Order not found' });
            return;
        }
        reply.code(200).send(updatedOrder);
    } catch (error) {
        reply.code(500).send(error);
    }
};

// Delete an order by ID
export const deleteOrderById = async (request: any, reply: any) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(request.params.id);
        if (!deletedOrder) {
            reply.code(404).send({ message: 'Order not found' });
            return;
        }
        reply.code(200).send({ message: 'Order deleted successfully' });
    } catch (error) {
        reply.code(500).send(error);
    }
};


export const sendMessageToKafka = async (req: any, res: FastifyReply) => {
    try {
        const { message } = req.body;
        const kafkaConfig = new KafkaConfig();
        const messages = [{ key: "key1", value: message }];
        await kafkaConfig.produce("Order", messages); // Assuming produce is an async method

        res.status(200).send({ message: "Message successfully sent!" });
    } catch (error) {
        console.error(error); // It's better to use console.error for errors
        res.status(500).send({ error: "Failed to send message" });
    }
};

