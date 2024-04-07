const KafkaConfig = require('../Kafka/config-kafka');
const Restaurant = require('../models/models'); 
const jwt = require('jsonwebtoken');

exports.createRestaurant = async (req, res) => {
    const { userId, Nom, Telephone, Email, Categorie, img, Horairesouverture, Menus, Articles } = req.body;
    try {
        const nouveauRestaurant = new Restaurant({ userId, Nom, Telephone, Email, Categorie, img, Horairesouverture, Menus, Articles });
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

exports.getRestaurantUser = async (req, res) => {
    const { id } = req.query;
    try {
        const restaurant = await Restaurant.findOne({userId: id});
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

exports.majMenuDansRestaurant = async (req, res) => {
    const { id } = req.query; // Supposons que vous passiez ces deux ID
    const { menuId } = req.params;
    try {
        // Trouver le restaurant par son ID
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant non trouvé" });
        }

        // Trouver le menu spécifique dans le restaurant
        const menuIndex = restaurant.Menus.findIndex(menu => menu._id.toString() === menuId);
        if (menuIndex === -1) {
            return res.status(404).json({ message: "Menu non trouvé" });
        }

        // Mise à jour du menu spécifique
        restaurant.Menus[menuIndex] = {...restaurant.Menus[menuIndex], ...req.body};

        // Sauvegarder les modifications sur le restaurant
        const updatedRestaurant = await restaurant.save();
        
        res.status(200).json(updatedRestaurant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.majArticleDansRestaurant = async (req, res) => {
    const { id } = req.query; // L'ID du restaurant
    const { articleId } = req.params; // L'ID de l'article à mettre à jour

    try {
        const restaurant = await Restaurant.findById(id); // Trouver le restaurant par son ID
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant non trouvé" });
        }

        // Trouver l'index de l'article dans le tableau des articles du restaurant
        const articleIndex = restaurant.Articles.findIndex(article => article._id.toString() === articleId);

        if (articleIndex === -1) {
            return res.status(404).json({ message: "Article non trouvé" });
        }
        restaurant.Articles[articleIndex] = {...restaurant.Articles[articleIndex].toObject(), ...req.body};

        // Sauvegarder les modifications apportées au restaurant
        const updatedRestaurant = await restaurant.save();

        res.status(200).json(updatedRestaurant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.ajouterMenuAuRestaurant = async (req, res) => {
    const { id } = req.query; // L'ID du restaurant
    try {
        const restaurant = await Restaurant.findById(id); // Trouver le restaurant par son ID
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant non trouvé" });
        }

        // Ajouter le nouveau menu au tableau des menus du restaurant
        const nouveauMenu = req.body; // Assurez-vous que le corps de la requête contient les détails du menu
        restaurant.Menus.push(nouveauMenu);

        // Sauvegarder les modifications apportées au restaurant
        const updatedRestaurant = await restaurant.save();

        res.status(201).json(updatedRestaurant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.ajouterArticleAuRestaurant = async (req, res) => {
    const { id } = req.query; // L'ID du restaurant
    try {
        const restaurant = await Restaurant.findById(id); // Trouver le restaurant par son ID
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant non trouvé" });
        }

        // Ajouter le nouvel article au tableau des articles du restaurant
        const nouvelArticle = req.body; // Assurez-vous que le corps de la requête contient les détails de l'article
        restaurant.Articles.push(nouvelArticle);

        // Sauvegarder les modifications apportées au restaurant
        const updatedRestaurant = await restaurant.save();

        res.status(201).json(updatedRestaurant);
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

exports.supprimerMenuDuRestaurant = async (req, res) => {
    const { id } = req.query; // L'ID du restaurant
    const { menuId } = req.params; // L'ID du menu à supprimer

    try {
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant non trouvé" });
        }

        // Retirer le menu du tableau des menus du restaurant
        restaurant.Menus = restaurant.Menus.filter(menu => menu._id.toString() !== menuId);

        await restaurant.save();
        
        res.status(200).json({ message: "Menu supprimé avec succès" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.supprimerArticleDuRestaurant = async (req, res) => {
    const { id } = req.query; // L'ID du restaurant
    const { articleId } = req.params; // L'ID de l'article à supprimer

    try {
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant non trouvé" });
        }

        // Retirer l'article du tableau des articles du restaurant
        restaurant.Articles = restaurant.Articles.filter(article => article._id.toString() !== articleId);

        await restaurant.save();
        
        res.status(200).json({ message: "Article supprimé avec succès" });
    } catch (error) {
        res.status(400).json({ message: error.message });
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
        const restaurantIdReq = req.query.id

        const restaurantUser = await Restaurant.findOne({ userId: decoded.userId });

        const restaurantIdUser = restaurantUser._id;

        const restaurantReq = await Restaurant.findById(restaurantIdReq);


    
            if (restaurantReq.userId.toString() !== decoded.userId) {
                return res.status(401).json({ message: "Accès non autorisé à ce restaurant" });
            }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token invalide, veuillez vous reconnecter" });
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

