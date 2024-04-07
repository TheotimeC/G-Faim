#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const axios = require('axios');
const inquirer = require('inquirer');
const figlet = require('figlet');
// Chemin vers le fichier de configuration pour stocker les tokens
const configFilePath = path.join(__dirname, '.tokens.json');

// Fonction pour sauvegarder les tokens dans un fichier
function saveTokens({ accessToken, refreshToken, apiKey }) {
  const tokens = { accessToken, refreshToken, apiKey };
  // Écriture des tokens dans le fichier sous forme de chaîne JSON
  fs.writeFileSync(configFilePath, JSON.stringify(tokens, null, 2), 'utf8');
}

function loadTokens() {
  if (fs.existsSync(configFilePath)) { // Use configFilePath here
    const config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
    return config;
  }
  return null;
}

const api = axios.create();

api.interceptors.response.use(undefined, async error => {
  const originalRequest = error.config;
  if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marquer la requête comme retentée
      const tokens = loadTokens(); // Charger les tokens
      if (!tokens || !tokens.refreshToken) {
          console.log('Refresh token manquant, veuillez vous reconnecter.');
          return Promise.reject(error); // Rejeter l'erreur si aucun refresh token
      }
      try {
          // Tentative de rafraîchissement du token
          const { data } = await axios.post('http://localhost:3000/auth/refresh', {
              refreshToken: tokens.refreshToken
          });
          // Sauvegarder le nouveau token
          tokens.accessToken = data.accessToken;
          fs.writeFileSync(configFilePath, JSON.stringify(tokens, null, 2), 'utf8');
          api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`; // Mettre à jour le token dans la requête originale
          return api(originalRequest); // Retenter la requête originale avec le nouveau token
      } catch (refreshError) {
          console.error('Erreur lors du rafraîchissement du token:', refreshError);
          return Promise.reject(error); // Rejeter l'erreur si le rafraîchissement du token échoue
      }
  } else if (error.response?.status === 401 && originalRequest._retry) {
      console.log('Accès non autorisé, veuillez vérifier vos credentials.');
      return Promise.reject(error); // Rejeter l'erreur si la deuxième tentative échoue également avec un 401
  }
  return Promise.reject(error); // Rejeter les autres erreurs
});
async function loginAction() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'email',
      message: 'Entrez votre email :',
    },
    {
      type: 'password',
      name: 'mot_de_passe',
      message: 'Entrez votre mot de passe :',
    },
  ]);

  try {
    const response = await axios.post('http://localhost:3000/auth/login', {
      email: answers.email,
      mot_de_passe: answers.mot_de_passe,
    });

    console.log('Connexion réussie !');
    saveTokens({ 
      accessToken: response.data.accessToken, 
      refreshToken: response.data.refreshToken,
      apiKey: response.data.apiKey
    });
    // Vous pouvez traiter la réponse ici, par exemple en sauvegardant le token d'accès
  } catch (error) {
    if (error.response) {
      console.error(`Erreur lors de la connexion : ${error.response.status} ${error.response.statusText}`);
    } else {
      console.error('Erreur lors de la connexion : Erreur de réseau ou le serveur est inaccessible.');
    }
  }
};


async function getAllRestaurantsAction() {
  const { accessToken, apiKey } = loadTokens(); // Load tokens from the saved file

    if (!accessToken || !apiKey) {
      console.error('Vous devez être connecté pour exécuter cette commande.');
      return;
    }

    try {
      const response = await api.get('http://localhost:3001/dev/restaurant/getAll', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'x-api-key': apiKey
        }
      });

      console.log('Restaurants récupérés avec succès:', response.data);
      // Traiter ici la réponse, par exemple afficher les restaurants récupérés
    } catch (error) {
      if (error.response) {
        console.error(`Erreur lors de la récupération des restaurants : ${error.response.status} ${error.response.statusText}`);
      } else {
        console.error('Erreur lors de la récupération des restaurants : Erreur de réseau ou le serveur est inaccessible.');
      }
    }
  };

program
  .version('0.0.1')

  console.log(figlet.textSync('G - Faim', {
    font: 'slant', // Choisissez parmi les polices disponibles dans figlet
    horizontalLayout: 'default',
    verticalLayout: 'default'
  }));
  
program
  .command('login')
  .description('Se connecter à votre compte')
  .action(loginAction);

// Add this after your existing code

program.command('getAllRestaurants')
  .description('Récupère tous les restaurants')
  .action(getAllRestaurantsAction);

  
program.parse(process.argv);
  

