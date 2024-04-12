import basicRoutes from './basic-routes';
import cors from "@fastify/cors";


export default function registerRoutes(fastifyInstance: any) {
    fastifyInstance.register(cors);
    fastifyInstance.register(basicRoutes, { prefix: '/api/payment' });
}