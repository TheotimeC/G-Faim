const User = require('../models/models');
const KafkaConfig = require('../Kafka/config-kafka');

exports.createUtilisateur = async (req, res) => {
    const { nom, prenom, telephone, email, mot_de_passe, adresses_de_livraison, code_parrain, total_personnes_parrainees } = req.body;
    try {
        const nouvelUtilisateur = new User({ nom, prenom, telephone, email, mot_de_passe, adresses_de_livraison, code_parrain, total_personnes_parrainees });
        await nouvelUtilisateur.save();
        res.status(201).json(nouvelUtilisateur);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getUtilisateurs = async (req, res) => {
    const { id } = req.query;
    try {
        const utilisateur = await User.findById(id);
        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.status(200).json(utilisateur);
    } catch (error) {
        res.status(500).json({ message: error.message });
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

