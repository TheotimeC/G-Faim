import api from "./api.ts";

const baseRoute = "http://localhost:3005/api/payment";

// Define the API interface for communicating with the backend for restaurant-related operations
const paymentApi = {
    // Create a new restaurant
    createCheckout: (userId: string, items: any[]) => api.post(`${baseRoute}/?userId=${userId}`, items),
    recordPayment: (userId: string, orderId: string, total: number) => api.post(`${baseRoute}/record`, { userId, orderId, total }),

};

export default paymentApi;
