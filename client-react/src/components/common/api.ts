// src/common/api.ts
import axios from 'axios';

// Créez une instance d'Axios avec une configuration de base
const api = axios.create();

// Ajoutez un intercepteur de réponse pour gérer le rafraîchissement du token
api.interceptors.response.use(
  response => response, // simplement retourner la réponse si tout va bien
  async error => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true; // Marquez que nous avons déjà essayé de rafraîchir le token
      try {
        // Ici, appelez le point de terminaison de rafraîchissement du token de votre serveur
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        const { data } = await axios.post('http://localhost:3002/auth/refresh', { refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        
        // Mettez à jour le token dans l'en-tête de la requête originale
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        
        // Renvoyez la requête originale avec le nouveau token
        return api(error.config);
      } catch (refreshError) {
        console.error('Erreur lors du rafraîchissement du token:', refreshError);
        // Ici vous pourriez vouloir gérer la déconnexion de l'utilisateur, par exemple
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
