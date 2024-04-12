import Fastify from 'fastify';
import dotenv from 'dotenv';
import * as process from 'process';
import registerRoutes from './src/routes/routes';

// Initialize dotenv for environment variable support
dotenv.config();

// Create a new Fastify instance with logging enabled
const fastify = Fastify({
    logger: true
});

// Set the port from environment variables or use a default
const PORT = process.env.PORT || 3005;

// Function to start the server
async function startServer() {
    try {
        // Register your routes
        registerRoutes(fastify);

        // Start listening for requests on the specified port
        await fastify.listen({port: Number(PORT)});

        console.log(`Server running at http://localhost:${PORT}`);
    } catch (err) {
        // Log any errors that occur during startup
        fastify.log.error(err);
        process.exit(1);
    }
}

// Kick off the server start process
startServer();
