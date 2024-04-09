import {FastifyReply} from "fastify";

import { KafkaConfig } from "../Kafka/config-kafka";
// Import the Order model
import Order, {RestaurantStatus} from "../models/models";

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
        if (cart)
            reply.code(200).send(cart);
        else
            reply.code(200).send({})
    } catch (error) {
        reply.code(500).send(error);
    }
};
export const setUserCartRestaurantId = async (request: any, reply: any) => {
    try {
        let cart = await Order.findOne({ userId: request.query.userId, status: 'cart' });
        if (!cart) {
            // Optionally create a new cart if one doesn't exist
            cart = new Order({
                userId: request.query.userId,
                restaurantId: request.query.restaurantId,
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

export const createCart = async (req: any, res: any) => {
    try {
        const userId = req.query.userId;
        const { restaurantId, item } = req.body;

        // Assuming item has a price and quantity, calculate subtotal for the initial item
        const subtotal = item.price * item.quantity;
        // Calculate deliveryFee based on subtotal - for example, 10% of subtotal
        const deliveryFee = subtotal * 0.1; // Adjust the percentage as necessary
        // Calculate total
        const total = subtotal + deliveryFee;

        // Create the new cart with the initial item and calculated totals
        const newCart = new Order({
            userId,
            restaurantId,
            items: [item], // Start with the provided item
            subtotal,
            deliveryFee,
            total,
            status: 'cart', // Ensure the status is set to 'cart'
            orderDate: new Date(), // Set the order date to now
        });

        // Save the new cart to the database
        await newCart.save();

        // Respond with the newly created cart
        res.status(201).send(newCart);
    } catch (error: any) {
        console.error('Failed to create cart:', error);
        res.status(500).send({ message: 'Failed to create the cart', error: error.toString() });
    }
};



export const addItemToCart = async (request: any, reply: any) => {
    try {
        const userId = request.query.userId; // Assuming userId is passed as a URL parameter
        const newItem  = request.body; // Extract the item and restaurantId from the request body
console.log(newItem)
        // Attempt to find an existing cart for the user
        let cart = await Order.findOne({ userId: userId, status: 'cart' });
        if (cart) {
            const existingItemIndex = cart.items.findIndex((item) => item.name === newItem.name);
            if (existingItemIndex !== -1) {
            cart.items[existingItemIndex].quantity += newItem.quantity;
            await cart.save();
            return reply.code(200).send(cart);
            }
            cart.items.push(newItem);
            cart.subtotal += newItem.price * newItem.quantity;
            cart.deliveryFee = cart.subtotal * 0.1; // Recalculate delivery fee
            cart.total = cart.subtotal + cart.deliveryFee;

            // Save the updated or new cart
            await cart.save();
            reply.code(201).send(cart);
        }
        else
            reply.code(500).send({message: 'Failed to add item to the cart, no cart existing'});

    } catch (error: any) {
        reply.code(500).send({ message: 'Failed to add item to the cart', error: error.toString() });
    }
};

export const deleteCart = async (request: any, reply: any) => {
    try {
        const userId = request.params.userId; // Assuming userId is passed as a URL parameter

        // Attempt to find and delete the cart
        const deletedCart = await Order.findOneAndDelete({ userId: userId, status: 'cart' });

        if (!deletedCart) {
            // If no cart was found to delete
            reply.code(404).send({ message: 'No cart found for this user.' });
            return;
        }

        // If a cart was successfully deleted
        reply.code(200).send({ message: 'Cart deleted successfully.' });
    } catch (error: any) {
        // Handle potential errors in finding and deleting the cart
        reply.code(500).send({ message: 'Failed to delete the cart', error: error.toString() });
    }
};

// Update the cart for a user, and delete if empty
export const updateCart = async (request: any, reply: any) => {
    try {
        const userId = request.query.userId; // Assuming userId is passed as a URL parameter

        // You might still want to check if the items array is empty to handle cart deletion
        if (request.body.items && request.body.items.length === 0) {
            const deletedCart = await Order.findOneAndDelete({ userId: userId, status: 'cart' });
            if (!deletedCart) {
                reply.code(404).send({ message: 'Cart not found' });
                return;
            }
            reply.code(200).send({ message: 'Cart deleted successfully' });
            return;
        }

        // Directly using the body with $set, assuming it's properly structured and sanitized
        let updatedCart = await Order.findOneAndUpdate(
            { userId: userId, status: 'cart' },
            { $set: request.body }, // Directly using the request body
            { new: true, upsert: true }
        );

        reply.code(200).send(updatedCart);
    } catch (error: any) {
        reply.code(500).send(error);
    }
};
export const deleteCartItem = async (req: any, res: any) => {
    try {
        const userId = req.query.userId; // The ID of the user
        const itemId = req.query.itemId; // The _id of the item to be removed

        // Find the user's cart and update it by removing the item with the specified _id
        const updatedCart = await Order.findOneAndUpdate(
            { userId: userId, status: 'cart' },
            { $pull: { items: { _id: itemId } } }, // Remove the item from the items array
            { new: true } // Option to return the updated document
        );

        if (updatedCart) {
            // Check if the cart is now empty
            if (updatedCart.items.length === 0) {
                // If the cart is empty, delete it
                await Order.deleteOne({ _id: updatedCart._id });
                res.status(200).send({ message: 'Cart is empty and has been deleted.' });
            } else {
                // If the cart still has items, return the updated cart
                res.status(200).send(updatedCart);
            }
        } else {
            // If the cart or item was not found
            res.status(404).send({ message: 'Cart or item not found.' });
        }
    } catch (error: any) {
        console.error('Failed to delete item from cart:', error);
        res.status(500).send({ message: 'Failed to delete item from the cart', error: error.toString() });
    }
};




// Get all orders
export const getAllOrders = async (request: any, reply: any) => {
    try {
        const orders = await Order.find({});
        reply.code(200).send(orders);
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
        reply.code(500).send(error);
    }
};
export const getOrderByRestaurantId = async (request: any, reply: any) => {
    try {
        const order = await Order.find({ restaurantId: request.query.restaurantId });
        console.log("request.query.restaurantId:",request.query.restaurantId)
        if (!order) {
            reply.code(404).send({ message: 'Order not found' });
            return;
        }
        reply.code(200).send(order);
    } catch (error: any) {
        reply.code(500).send(error);
    }
};

export const getCurrentOrderByRestaurantId = async (request: any, reply: any) => {
    try {
        const order = await Order.find({ restaurantId: request.query.restaurantId });
        if (!order) {
            reply.code(404).send({ message: 'Order not found' });
            return;
        }
        order.filter((order) => order.restaurantStatus !== RestaurantStatus.READY)
        reply.code(200).send(order);
    } catch (error: any) {
        reply.code(500).send(error);
    }
};

export const setOrderRestaurantStatus = async (request: any, reply: any) => {
    try {
        // Validate the restaurantStatus from the request body
        const restaurantStatus = request.body.restaurantStatus;
        if (!Object.values(RestaurantStatus).includes(restaurantStatus)) {
            reply.code(400).send({ message: 'Invalid restaurant status' });
            return;
        }

        // Proceed with the update since the status is valid
        const updateOrder = await Order.findByIdAndUpdate(
            request.query.id,
            { restaurantStatus: restaurantStatus },
            { new: true }
        );

        if (!updateOrder) {
            reply.code(404).send({ message: 'Order not found' });
            return;
        }

        reply.code(200).send(updateOrder);
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
        console.error(error); // It's better to use console.error for errors
        res.status(500).send({ error: "Failed to send message" });
    }
};

