import Fastify from 'fastify';
import dotenv from 'dotenv'
import cors from '@fastify/cors'
import * as mongoose from "mongoose";
import * as process from "process";
import registerRoutes from "./src/routes/routes";
import { KafkaConfig } from './src/Kafka/config-kafka';

dotenv.config();
const fastify = Fastify({
    logger: true
})

const PORT = process.env.PORT || 3002;

// @ts-ignore
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(async () => {
        console.log('Connecté a MongoDB');
        const kafkaConfig = new KafkaConfig();
        registerRoutes(fastify);
        await fastify.listen({port: 3002});
        console.log(`Server running at http://localhost:${PORT}`);
    })
    .catch(err => console.error('Erreur connection MongoDB:', err));




