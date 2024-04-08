// src/common/api.ts
import axios from 'axios';

const api = axios.create();

const LOGS_API_URL = 'http://localhost:3004/logs/create';
const ID_API_URL = 'http://localhost:3000/user/getId';

const getUserIdFromToken = async() =>{
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  try {
    const response = await axios.get(ID_API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    }); 
    console.log("response.data._id",response.data._id)
    return response.data._id;
  } catch (error) {
    console.error("Erreur lors de l'envoi du log au serveur:", error);
  }
}

// Fonction helper pour envoyer des logs
const sendLog = async (logData:any) => {
  try {
    await axios.post(LOGS_API_URL, logData); // logData est un objet structuré
  } catch (error) {
    console.error("Erreur lors de l'envoi du log au serveur:", error);
  }
};

// Intercepteur de requêtes pour les logs
api.interceptors.request.use(async (config) => {
  var userId = await getUserIdFromToken();
  const logData = {
    entityType: 'Request', // ou un autre identifiant selon le contexte
    entityId: config.url, // exemple simplifié, ajustez selon vos besoins
    action: `${config.method ? `${config.method.toUpperCase()}` : ''}`,
    description: `${config.url}`,
    timestamp: new Date(), // sera généré par défaut dans MongoDB, mais peut être inclus ici
    userId: userId,
    // additionalData: {...} Vous pouvez ajouter des données supplémentaires si nécessaire
  };
  console.log("logData :",logData)
  
  sendLog(logData);
  return config;
}, async (error) => {
  // Créer un objet logData pour l'erreur
  const logData = {
    entityType: 'RequestError',
    entityId: error.config.url, // Utiliser url depuis error.config
    action: 'Error',
    description: `${error.config.url}: ${error.message}`,
    timestamp: new Date(), // comme ci-dessus
  };
  
  sendLog(logData);
  return Promise.reject(error);
});

api.interceptors.response.use(response => {
  console.log(`Réponse reçue de ${response.config.url} avec le statut ${response.status} à ${new Date().toISOString()}`);
  return response;
}, async error => {
      if (error.response) {
        const logMessage = `Erreur dans la réponse de ${error.response.config.url} - Status: ${error.response.status} - Date/Time: ${new Date().toISOString()}`;
        sendLog(logMessage);
      } else if (error.request) {
        sendLog(`Aucune réponse reçue pour la requête à ${error.request.url} - Date/Time: ${new Date().toISOString()}`);
      } else {
        sendLog(`Erreur de configuration de la requête - ${error.message}`);
      }
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
