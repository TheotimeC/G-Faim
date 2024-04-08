import api from "./api.ts"
import axios from "axios";

const baseRoute = "http://localhost:3002/api"
// Define the API interface for communicating with the backend
const orderApi = {
    // User Routes
    getUserCart: (userId: string) => api.get(baseRoute + `/users/cart?userId=${userId}`),
    updateCart: (userId: string, cartData: any) => api.put(baseRoute + `/users/cart?userId=${userId}`, cartData),
    itemId: (userId: string, restaurantId: string, item: any) => axios.put(baseRoute + `/users/cart/create?userId=${userId}`, {restaurantId, item} ),
    addItemToCart: (userId: string, itemData: any) => api.put(baseRoute + `/users/cart/item?userId=${userId}`, itemData),
    deleteCart: (userId: string) => api.delete(baseRoute + `/users/cart?userId=${userId}`),
    deleteCartItem: (userId: string, itemId: string) => api.delete(baseRoute + `/users/cart/item?userId=${userId}&itemId=${itemId}`),

    // Restaurant Routes
    getOrdersByRestaurantId: (restaurantId: string) => api.get(baseRoute + `/restaurants?restaurantId=${restaurantId}`),
    getCurrentOrdersByRestaurantId: (restaurantId: string) => api.get(baseRoute + `/restaurants/current?restaurantId=${restaurantId}`),
    setRestaurantStatus: (restaurantId: string, status: any) => api.put(baseRoute + `/restaurants/status?restaurantId=${restaurantId}`, { status }),

    // Basic Routes
    createOrder: (orderData: any) => api.post(baseRoute + '/orders', orderData),
    getAllOrders: () => api.get(baseRoute + '/orders'),
    getOrderById: (orderId: string) => api.get(baseRoute + `/orders/${orderId}`),
    updateOrderById: (orderId: string, updateData: any) => api.put(baseRoute + `/orders/${orderId}`, updateData),
    deleteOrderById: (orderId: string) => api.delete(baseRoute + `/orders/${orderId}`),

    // Kafka Message Route
    sendMessageToKafka: (message: any) => api.post(baseRoute + '/orders/kafka/message', message),
};

export default orderApi;
