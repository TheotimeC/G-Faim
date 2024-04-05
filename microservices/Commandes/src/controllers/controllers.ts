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
// Retrieve or create a cart for a user
export const getUserCart = async (request: any, reply: any) => {
    try {
        let cart = await Order.findOne({ userId: request.query.userId, status: 'cart' });
        if (!cart) {
            // Optionally create a new cart if one doesn't exist
            cart = new Order({
                userId: request.query.userId,
                items: [],
                subtotal: 0,
                deliveryFee: 0, // Adjust as necessary
                total: 0,
                status: 'cart',
            });
            await cart.save();
        }
        reply.code(200).send(cart);
    } catch (error) {
        reply.code(500).send(error);
    }
};
// Update the cart for a user, and delete if empty
export const updateCart = async (request: any, reply: any) => {
    try {
        const { userId, items } = request.body;

        // If items array is empty, delete the cart
        if (items.length === 0) {
            const deletedCart = await Order.findOneAndDelete({ userId: userId, status: 'cart' });
            if (!deletedCart) {
                reply.code(404).send({ message: 'Cart not found' });
                return;
            }
            reply.code(200).send({ message: 'Cart deleted successfully' });
            return;
        }

        // Calculate subtotal and total based on items
        let subtotal = items.reduce((acc: any, item: any) => acc + (item.quantity * item.price), 0);
        let deliveryFee = 5; // Example delivery fee, adjust as necessary
        let total = subtotal + deliveryFee;

        let updatedCart = await Order.findOneAndUpdate(
            { userId: userId, status: 'cart' },
            { $set: { items: items, subtotal: subtotal, total: total, deliveryFee: deliveryFee } },
            { new: true, upsert: true } // Upsert option creates a new document if no cart exists
        );

        reply.code(200).send(updatedCart);
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
        const order = await Order.find({ userId: request.query.userId });
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

