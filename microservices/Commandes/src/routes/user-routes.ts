import {FastifyInstance} from "fastify";
import * as orderController from "../controllers/controllers";

export default async function (fastify: FastifyInstance) {
    fastify.get('/', {
        handler: orderController.getOrderByUserId,
    });
    // GET route to retrieve the user's cart
    fastify.get('/cart', {
        handler: orderController.getUserCart,
    });

    // PUT route to update the user's cart
    fastify.put('/cart', {
        handler: orderController.updateCart,
    });

    // PUT route to update the user's cart
    fastify.put('/cart/create', {
        handler: orderController.createCart,
    });
    // PUT route to update the user's cart
    fastify.put('/cart/item', {
        handler: orderController.addItemToCart,
    });
    fastify.delete('/cart/item', {
        handler: orderController.deleteCartItem,
    });
    // PUT route to update the user's cart
    fastify.delete('/cart', {
        handler: orderController.deleteCart,
    });
}