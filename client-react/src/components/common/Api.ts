// src/common/api.ts
import axios from 'axios';

const api = axios.create();

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // S'il n'y a pas de refreshToken, on déclenche directement l'événement de déconnexion
          const event = new CustomEvent('logout-event');
          window.dispatchEvent(event);
          return Promise.reject(new Error('No refresh token available'));
        }
        const { data } = await axios.post('http://localhost:3000/auth/refresh', { refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        return api(error.config);
      } catch (refreshError) {
        console.error('Erreur lors du rafraîchissement du token:', refreshError);
        // Émettre l'événement de déconnexion après l'échec du rafraîchissement du token
        const event = new CustomEvent('logout-event');
        window.dispatchEvent(event);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
