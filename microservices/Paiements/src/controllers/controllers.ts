// Import necessary modules
import { FastifyRequest, FastifyReply } from 'fastify';
import Stripe from 'stripe';
import sqlite3 from 'sqlite3';
import dotenv from "dotenv";
import process from "process";
dotenv.config();
// Initialize Stripe
// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_KEY, {
    apiVersion: '2024-04-10',
});

// SQLite database initialization and helper functions
const db = new sqlite3.Database('./database.sqlite', err => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Database opened successfully');
        // Ensure your payments table exists; adjust columns as needed
        db.run(`CREATE TABLE IF NOT EXISTS payments 
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sessionId TEXT,
      userId TEXT,
      amount INTEGER
    )`);
    }
});

// Helper function to run SQL queries with Promises
const dbQuery = (sql: string, params: any[] = []) =>
    new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
                return;
            }
            resolve({ id: this.lastID });
        });
    });

export const createCheckoutSession = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        // @ts-ignore
        const userId = req.query.userId; // Make sure you securely authenticate and validate this in a real application
        const items = req.body; // Your frontend should send an array of item objects
        // Calculate the total item cost
        // @ts-ignore
        const totalItemCost = items.reduce((total, item) => total + (item.price * item.quantity), 0);

        // Calculate shipping as 10% of the total item cost
        const shippingCost = Math.round(totalItemCost * 0.10);
        // Map your items to Stripe's line_items format using price_data for dynamic pricing
        // @ts-ignore
        const lineItems = items.map((item: any) => ({
            price_data: {
                currency: 'eur', // Set your currency
                product_data: {
                    name: item.name,
                    description: item.description,
                    images: [item.imgSrc], // Images array
                },
                unit_amount: item.price * 100, // Convert price to the smallest currency unit
            },
            quantity: item.quantity,
        }));
        // Add shipping as a separate line item
        lineItems.push({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: "Livraison",
                    description: "Frais de livraison",
                },
                unit_amount: shippingCost * 100, // Convert to cents
            },
            quantity: 1, // Shipping charge is a one-time fee
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://localhost:5173/?success=true',
            cancel_url: 'http://localhost:5173/?cancel=true',
        });

        // Record the payment details in the database
        // Calculate the total amount from lineItems if needed for recordPayment
        const totalAmount = totalItemCost + shippingCost;
        await recordPayment(session.id, userId, totalAmount);

        // @ts-ignore
        res.status(200).send(session.url);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to create checkout session' });
    }
};


export const recordPayment = async (sessionId: string, userId: string, amount: number): Promise<any> => {
    try {
        const result = await dbQuery('INSERT INTO payments (sessionId, userId, amount) VALUES (?, ?, ?)', [
            sessionId,
            userId,
            amount,
        ]);
        // @ts-ignore
        console.log('Payment recorded with ID:', result.id);
        return result;
    } catch (error) {
        console.error('Failed to record payment:', error);
        throw error;
    }
};

// Additional controller functions can go here
