// routes.ts
import { FastifyInstance } from 'fastify';
import * as orderController from '../controllers/controllers'; // Adjust the import path as necessary

export default async function (fastify: FastifyInstance) {

    fastify.get('/orders/user', {
        handler: orderController.getOrderByUserId,
    });
    // GET route to retrieve the user's cart
    fastify.get('/orders/cart', {
        handler: orderController.getUserCart,
    });

    // PUT route to update the user's cart
    fastify.put('/orders/cart', {
        handler: orderController.updateCart,
    });
    // POST route to create a new order
    fastify.post('/orders', {
        handler: orderController.createOrder,
    });

    // GET route to retrieve all orders
    fastify.get('/orders', {
        handler: orderController.getAllOrders,
    });

    // GET route to retrieve a single order by ID
    fastify.get('/orders/:id', {
        handler: orderController.getOrderById,
    });

    // PUT route to update an order by ID
    fastify.put('/orders/:id', {
        handler: orderController.updateOrderById,
    });

    // DELETE route to delete an order by ID
    fastify.delete('/orders/:id', {
        handler: orderController.deleteOrderById,
    });

    // POST route to send a message to Kafka
    fastify.post('/kafka/message', {
        handler: orderController.sendMessageToKafka,
    });

}