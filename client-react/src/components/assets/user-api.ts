import api from "./api.ts";
const API_URL = 'http://localhost:3000/user';
export const getUserId = async () => {
    
    const token = localStorage.getItem('accessToken')
    const response = await api.get(`${API_URL}/getId/`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data._id;
}