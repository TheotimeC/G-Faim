const Commandes = require('../models/models');
const KafkaConfig = require('../Kafka/config-kafka');
const jwt = require('jsonwebtoken');


exports.createOrder = async (req, res) => {
    try {
      const orderData = req.body; // Assurez-vous que le corps de la requête contient les données de la commande
      const order = new Commandes({
        userId: orderData.userId,
        restaurantId: orderData.restaurantId,
        articles: orderData.articles,
        status: 'en préparation', //  état initial
        deliveryAddress: orderData.deliveryAddress,
        LivreurId: null, // Initialisé à null, sera mis à jour lors de l'assignation
        isPickedUp: false,
        totalPrice: orderData.totalPrice,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await order.save();
      res.status(201).json(order);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Une erreur est survenue en créeant la commande." });
    }
  };

  exports.getOrder = async (req, res) => {
    try {
      const { orderId } = req.query; // On s'attend à ce que l'ID de la commande soit passé comme paramètre d'URL
      const order = await Commandes.findById(orderId);
      if (order) {
        res.status(200).json(order);
      } else {
        res.status(404).json({ message: "Commande non trouvée." });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Une erreur est survenue en récuperant la commande." });
    }
  };

  exports.getOrderStatus = async (req, res) => {
    try {
      const { orderId } = req.query; // On s'attend à ce que l'ID de la commande soit passé comme paramètre d'URL
      const order = await Commandes.findById(orderId, 'status'); // Sélectionne uniquement le champ 'status'
      if (order) {
        res.status(200).json({ status: order.status });
      } else {
        res.status(404).json({ message: "Commande non trouvée." });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Une erreur est survenue en  le status la commande." });
    }
  };

  exports.assigneLivreur = async (req, res) => {
    try {
      const { orderId, getLivreurId } = req.body; // S'attend à ce que l'ID de la commande et l'ID du livreur soient fournis dans le corps de la requête
      const updatedOrder = await Commandes.findByIdAndUpdate(orderId, {
        LivreurId: getLivreurId,
        isPickedUp: true,
        status: 'en livraison'
      }, { new: true });
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Une erreur est survenue en assignant le livreur à la commande." });
    }
  };

  exports.updateStatus = async (req, res) => {
    try {
      const { orderId, status } = req.body; // S'attend à ce que l'ID de la commande et le nouveau statut soient fournis dans le corps de la requête
      const updatedOrder = await Commandes.findByIdAndUpdate(orderId, {
        status: status,
        updatedAt: new Date(),
      }, { new: true });
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Une erreur est survenue en modifiant le statut de la commande." });
    }
  };
  
  
  
/*
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
};*/

exports.sendMessageToKafka = async (req, res) => {
    try {
      const { message } = req.body;
      const kafkaConfig = new KafkaConfig();
      const messages = [{ key: "key1", value: message }];
      kafkaConfig.produce("Commandes", messages);
  
      res.status(200).json({ message: "Message successfully send!",
  });
    } catch (error) {
      console.log(error);
    }
  };

