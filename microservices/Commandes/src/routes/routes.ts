import userRoutes from './user-routes';
import restaurantRoutes from './restaurant-routes';
import basicRoutes from './basic-routes';
import cors from "@fastify/cors";
;


export default function registerRoutes(fastifyInstance: any) {
    fastifyInstance.register(cors);
    fastifyInstance.register(userRoutes, { prefix: '/api/users' });
    fastifyInstance.register(restaurantRoutes, { prefix: '/api/restaurants' });
    fastifyInstance.register(basicRoutes, { prefix: '/api/orders' });
}