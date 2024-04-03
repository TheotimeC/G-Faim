const KafkaConfig = require('../Kafka/config-kafka');
const Restaurant = require('../models/models'); // Assurez-vous que le chemin d'accès est correct
// KafkaConfig peut rester tel quel si vous l'utilisez dans ce contexte

exports.createRestaurant = async (req, res) => {
    const { Nom, Telephone, Email, Categorie, img, Horairesouverture, Menus, Articles } = req.body;
    try {
        const nouveauRestaurant = new Restaurant({ Nom, Telephone, Email, Categorie, img, Horairesouverture, Menus, Articles });
        await nouveauRestaurant.save();
        res.status(201).json(nouveauRestaurant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getRestaurant = async (req, res) => {
    const { id } = req.query;
    try {
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant non trouvé" });
        }
        res.status(200).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllRestaurants = async (req, res) => {
    try {
        // Utilisation de find sans argument pour récupérer tous les documents de la collection
        const restaurants = await Restaurant.find({});
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.majRestaurant = async (req, res) => {
    const { id } = req.query; 
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(id, req.body, { new: true });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant non trouvé" });
        }
        res.status(200).json(restaurant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.delRestaurant = async (req, res) => {
    const { id } = req.query; 
    try {
        const restaurant = await Restaurant.findByIdAndDelete(id);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant non trouvé" });
        }
        res.status(200).json({ message: "Restaurant supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.sendMessageToKafka = async (req, res) => {
    try {
      const { message } = req.body;
      const kafkaConfig = new KafkaConfig();
      const messages = [{ key: "key1", value: message }];
      kafkaConfig.produce("Restaurants", messages);
  
      res.status(200).json({ message: "Message successfully send!",
  });
    } catch (error) {
      console.log(error);
    }
  };

