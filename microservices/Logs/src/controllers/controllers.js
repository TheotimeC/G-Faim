const Log = require('../models/models');
const KafkaConfig = require('../Kafka/config-kafka');
const jwt = require('jsonwebtoken');


exports.createLog = async (req, res) => {
    const { entityType, entityId, action, userId, description, additionalData } = req.body;

    try {
        const newLog = new Log({
            entityType,
            entityId,
            action,
            userId,
            description,
            additionalData
        });

        await newLog.save();
        res.status(201).json({ message: "Log created successfully", log: newLog });
    } catch (error) {
        res.status(500).json({ message: "Error creating log", error: error.message });
    }
};

exports.getLogs = async (req, res) => {
    try {
        const logs = await Log.find({});
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving logs", error: error.message });
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

    if (!token) {
        return res.status(401).json({ message: "Vous n'êtes pas autorisé à accéder à cette ressource"  });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT);
        req.user = await User.findById(decoded.userId).select('-mot_de_passe');
        next();
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
            res.status(200).json(utilisateur);
        } else {
            return res.status(401).json({ message: "Token invalide, veuillez vous reconnecter" });
        }
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

