const User = require('../models/models');
const Restaurant = require('../models/models')
const KafkaConfig = require('../Kafka/config-kafka');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');

exports.createUtilisateur = async (req, res) => {
    const { role, nom, prenom, telephone, email, mot_de_passe, adresses_de_livraison, code_parrain, total_personnes_parrainees } = req.body;
    try {
        const nouvelUtilisateur = new User({ role, nom, prenom, telephone, email, mot_de_passe, adresses_de_livraison, code_parrain, total_personnes_parrainees });
        await nouvelUtilisateur.save();
        res.status(201).json(nouvelUtilisateur);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.majUtilisateur = async (req, res) => {
    const { id } = req.query; 
    try {
        const utilisateur = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.status(200).json(utilisateur);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.delUtilisateur = async (req, res) => {
    const { id } = req.query; 
    try {
        const utilisateur = await User.findByIdAndDelete(id);
        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, mot_de_passe } = req.body;
    try {
        const utilisateur = await User.findOne({ email });
        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        const isValid = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
        if (!isValid) {
            return res.status(400).json({ message: "Mot de passe invalide" });
        }
        const role = utilisateur.role;
        const apiKey = utilisateur.apiKey;
        console.log("utilisateur: ",utilisateur);
        console.log("utilisateur.apiKey: ",utilisateur.apiKey);
        // Générer l'access token avec une expiration courte (par exemple, 15 minutes)
        const accessToken = jwt.sign(
            { userId: utilisateur._id, email: utilisateur.email },
            process.env.JWT,
            { expiresIn: '15m' }
        );

        // Générer le refresh token avec une expiration plus longue (par exemple, 7 jours)
        const refreshToken = jwt.sign(
            { userId: utilisateur._id },
            process.env.JWTREFRESH,
            { expiresIn: '7d' }
        );
        const API_URL = 'http://localhost:3001/restaurant';
            console.log("utilisateur.role:",utilisateur.role)
        if (utilisateur.role === 'restaurateur') {
            const response = await axios.get(`${API_URL}/getUser/`, {params: { id: utilisateur._id }});
            const restaurant = response.data;
            const restaurantId = restaurant._id;
            if (restaurant) {
                // Générez votre token ici
                return res.json({ accessToken, refreshToken, role, restaurantId, apiKey });
            }
        }

        res.status(200).json({ accessToken, refreshToken, role, apiKey  });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyApiKey = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        return res.status(401).json({ message: "API Key is missing" });
    }

    try {
        const user = await User.findOne({ apiKey: apiKey });
        if (!user) {
            return res.status(401).json({ message: "Invalid API Key" });
        }

        req.user = user;
        res.status(200).json({ message: "Token vérifié avec succès", user: req.user });
    } catch (error) {
        return res.status(500).json({ message: "Server error during API key validation" });
    }
};

exports.refreshTokens = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ message: "Token de rafraîchissement manquant" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWTREFRESH);
        const utilisateur = await User.findById(decoded.userId);

        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Générer un nouveau access token
        const accessToken = jwt.sign(
            { userId: utilisateur._id, email: utilisateur.email },
            process.env.JWT,
            { expiresIn: '15m' }
        );

        // Générer un nouveau refresh token
        const newRefreshToken = jwt.sign(
            { userId: utilisateur._id },
            process.env.JWTREFRESH,
            { expiresIn: '7d' }
        );

        res.status(200).json({ accessToken, newRefreshToken });
    } catch (error) {
        // Gérer spécifiquement les erreurs d'expiration et les erreurs de validation du token
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Token de rafraîchissement invalide ou expiré" });
        }
        // Pour toutes les autres erreurs potentielles
        res.status(500).json({ message: error.message });
    }
};

exports.protect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    console.log("token",token)
    if (!token) {
        return res.status(401).json({ message: "Vous n'êtes pas autorisé à accéder à cette ressource"  });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT);
        req.user = await User.findById(decoded.userId).select('-mot_de_passe');
        res.status(200).json(req.user);
    } catch (error) {
        return res.status(401).json({ message: "Token invalide, veuillez vous reconnecter" });
    }
};

exports.getUtilisateursId = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        // Décodez le token pour obtenir les informations
        const decoded = jwt.verify(token, process.env.JWT);

        // Assurez-vous que l'ID de l'utilisateur est disponible dans les informations décodées
        if (decoded && decoded.userId) {
            const utilisateur = await User.findById(decoded.userId);
            if (!utilisateur) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }
            // Retournez l'ID de l'utilisateur
            res.status(200).json(utilisateur.email);
        } else {
            return res.status(401).json({ message: "Token invalide, veuillez vous reconnecter" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUtilisateurs = async (req, res) => {
    try {
            const getUtilisateurss = await User.find({});
            res.status(200).json(utilisateur);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.sendMessageToKafka = async (req, res) => {
    try {
      const { message } = req.body;
      const kafkaConfig = new KafkaConfig();
      const messages = [{ key: "key1", value: message }];
      kafkaConfig.produce("Users", messages);
  
      res.status(200).json({ message: "Message successfully send!",
  });
    } catch (error) {
      console.log(error);
    }
  };

