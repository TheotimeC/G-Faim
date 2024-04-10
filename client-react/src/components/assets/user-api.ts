import api from "./api.ts";
const API_URL = 'http://localhost:3000/user';
export const getUserId = async () => {
    try {
        const token = localStorage.getItem('accessToken')
        const response = await api.get(`${API_URL}/getId/`, {
            headers: {Authorization: `Bearer ${token}`}
        });
        return response.data._id;
    }catch(error: any){
        console.error("No accessToken, is user authenticated ?");
        return null;
    }
}