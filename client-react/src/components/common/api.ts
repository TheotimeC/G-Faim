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
    console.log("REP:",response.data._id)
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
  var userid;
  getUserIdFromToken().then(userId => {
      userid = userId 
  });
  const logData = {
    entityType: 'Request', // ou un autre identifiant selon le contexte
    entityId: config.url, // exemple simplifié, ajustez selon vos besoins
    action: `${config.method ? `${config.method.toUpperCase()}` : ''}`,
    description: `Requête envoyée à ${config.url}`,
    timestamp: new Date(), // sera généré par défaut dans MongoDB, mais peut être inclus ici
    userId: userid,
    // additionalData: {...} Vous pouvez ajouter des données supplémentaires si nécessaire
  };
  console.log("logData :",logData)
  
  await sendLog(logData);
  return config;
}, async (error) => {
  // Créer un objet logData pour l'erreur
  const logData = {
    entityType: 'RequestError',
    entityId: error.config.url, // Utiliser url depuis error.config
    action: 'Error',
    description: `Erreur lors de l'envoi d'une requête à ${error.config.url}: ${error.message}`,
    timestamp: new Date(), // comme ci-dessus
    // additionalData: {...} données supplémentaires sur l'erreur
  };
  
  await sendLog(logData);
  return Promise.reject(error);
});

// Gestion des erreurs de réponse
api.interceptors.response.use(response => {
  console.log(`Réponse reçue de ${response.config.url} avec le statut ${response.status} à ${new Date().toISOString()}`);
  return response;
}, async error => {
  if (error.response) {
    // Récupération de l'ID utilisateur depuis le token stocké
    const userId = await getUserIdFromToken();
    const logData = {
      entityType: 'ResponseError',
      entityId: error.config.url,
      action: `${error.response.status}`,
      userId: userId, // Utiliser l'ID utilisateur récupéré
      description: `Erreur dans la réponse de ${error.config.url} - Status: ${error.response.status} - Message: ${error.message}`,
      timestamp: new Date(),
      // additionalData: {...} données supplémentaires sur l'erreur
    };
    await sendLog(logData);
  } else if (error.request) {
    // Si aucune réponse n'a été reçue pour la requête
    const userId = await getUserIdFromToken();
    const logData = {
      entityType: 'RequestError',
      entityId: error.request.url,
      action: 'NoResponse',
      userId: userId,
      description: `Aucune réponse reçue pour la requête à ${error.request.url}`,
      timestamp: new Date(),
      // additionalData: {...}
    };
    await sendLog(logData);
  } else {
    // Autres erreurs de configuration de la requête
    console.error(`Erreur de configuration de la requête - ${error.message}`);
  }

  // Gestion de la reconnexion automatique si le token est expiré
  if (error.response?.status === 401 && !error.config._retry) {
    error.config._retry = true;
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        const event = new CustomEvent('logout-event');
        window.dispatchEvent(event);
        return Promise.reject(new Error('No refresh token available'));
      }
      const { data } = await axios.post('http://localhost:3000/auth/refresh', { refreshToken });
      localStorage.setItem('accessToken', data.accessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
      error.config.headers['Authorization'] = `Bearer ${data.accessToken}`;
      return api(error.config);
    } catch (refreshError) {
      console.error('Erreur lors du rafraîchissement du token:', refreshError);
      const event = new CustomEvent('logout-event');
      window.dispatchEvent(event);
      return Promise.reject(refreshError);
    }
  }
  return Promise.reject(error);
});


export default api;
