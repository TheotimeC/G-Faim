import api from "./api.ts";

const baseRoute = "http://localhost:3001";

// Define the API interface for communicating with the backend for restaurant-related operations
const restaurantApi = {
    // Create a new restaurant
    createRestaurant: (restaurantData: any) => api.post(`${baseRoute}/restaurant/create`, restaurantData),

    // Add an article to a restaurant
    addArticleToRestaurant: (articleData: any) => api.post(`${baseRoute}/restaurant/create/article`, articleData),

    // Add a menu to a restaurant
    addMenuToRestaurant: (menuData: any) => api.post(`${baseRoute}/restaurant/create/menu`, menuData),

    // Update restaurant details
    updateRestaurant: (restaurantId: string, updateData: any) => api.put(`${baseRoute}/restaurant/modify?restaurantId=${restaurantId}`, updateData),

    // Update a menu within a restaurant
    updateMenuInRestaurant: (restaurantId: string, menuId: string, menuData: any) => api.put(`${baseRoute}/restaurant/modify/menu/${menuId}?restaurantId=${restaurantId}`, menuData),

    // Update an article within a restaurant
    updateArticleInRestaurant: (restaurantId: string, articleId: string, articleData: any) => api.put(`${baseRoute}/restaurant/modify/article/${articleId}?restaurantId=${restaurantId}`, articleData),

    // Delete a restaurant
    deleteRestaurant: (restaurantId: string) => api.delete(`${baseRoute}/restaurant/delete?restaurantId=${restaurantId}`),

    // Delete an article from a restaurant
    deleteArticleFromRestaurant: (restaurantId: string, articleId: string) => api.delete(`${baseRoute}/restaurant/delete/article/${articleId}?restaurantId=${restaurantId}`),

    // Delete a menu from a restaurant
    deleteMenuFromRestaurant: (restaurantId: string, menuId: string) => api.delete(`${baseRoute}/restaurant/delete/menu/${menuId}?restaurantId=${restaurantId}`),

    // Get a single restaurant's details
    getRestaurant: (restaurantId: string) => api.get(`${baseRoute}/restaurant/get?restaurantId=${restaurantId}`),
    getRestaurantNameById: (restaurantId: string) => api.get(`${baseRoute}/restaurant/name?restaurantId=${restaurantId}`),

    // Get all restaurants
    getAllRestaurants: () => api.get(`${baseRoute}/restaurant/getAll`),

    // Get a restaurant by a user's ID
    getRestaurantByUser: (userId: string) => api.get(`${baseRoute}/restaurant/getUser?userId=${userId}`),
};

export default restaurantApi;
