import {FastifyInstance} from "fastify";
import * as orderController from "../controllers/controllers";

export default async function (fastify: FastifyInstance) {
    fastify.get('/current', {
        handler: orderController.getCurrentOrderByRestaurantId,
    });
    fastify.put('/status', {
        handler: orderController.setOrderRestaurantStatus,
    });
    fastify.get('/', {
        handler: orderController.getOrderByRestaurantId,
    });
}