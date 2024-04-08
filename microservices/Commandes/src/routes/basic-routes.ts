// basic-routes.ts
import { FastifyInstance } from 'fastify';
import * as orderController from '../controllers/controllers'; // Adjust the import path as necessary

export default async function (fastify: FastifyInstance) {


    // POST route to create a new order
    fastify.post('/', {
        handler: orderController.createOrder,
    });

    // GET route to retrieve all orders
    fastify.get('/', {
        handler: orderController.getAllOrders,
    });

    // GET route to retrieve a single order by ID
    fastify.get('/:id', {
        handler: orderController.getOrderById,
    });

    // PUT route to update an order by ID
    fastify.put('/:id', {
        handler: orderController.updateOrderById,
    });

    // DELETE route to delete an order by ID
    fastify.delete('/:id', {
        handler: orderController.deleteOrderById,
    });

    // POST route to send a message to Kafka
    fastify.post('/kafka/message', {
        handler: orderController.sendMessageToKafka,
    });

}