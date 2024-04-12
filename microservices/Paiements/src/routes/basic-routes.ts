// basic-routes.ts
import { FastifyInstance } from 'fastify';
import * as paiementController from '../controllers/controllers'; // Adjust the import path as necessary

export default async function (fastify: FastifyInstance) {


    // POST route to create a new order
    fastify.post('/', {
        handler: paiementController.createCheckoutSession,
    });
    // fastify.post('record/', {
    //     handler: paiementController.recordPayment,
    // });


}