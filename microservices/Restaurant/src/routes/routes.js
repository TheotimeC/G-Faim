const express = require('express');
const router = express.Router();
const taskController = require('../controllers/controllers');

router.post('/restaurant/create', taskController.createRestaurant);
router.post('/restaurant/create/article',taskController.protect, taskController.ajouterArticleAuRestaurant);
router.post('/restaurant/create/menu',taskController.protect, taskController.ajouterMenuAuRestaurant);

router.put('/restaurant/modify',taskController.protect, taskController.majRestaurant);
router.put('/restaurant/modify/menu/:menuId',taskController.protect, taskController.majMenuDansRestaurant);
router.put('/restaurant/modify/article/:articleId',taskController.protect, taskController.majArticleDansRestaurant);

router.delete('/restaurant/delete',taskController.protect, taskController.delRestaurant);
router.delete('/restaurant/delete/article/:articleId',taskController.protect, taskController.supprimerArticleDuRestaurant);
router.delete('/restaurant/delete/menu/:menuId',taskController.protect, taskController.supprimerMenuDuRestaurant);

router.get('/restaurant/get', taskController.getRestaurant);
router.get('/restaurant/getAll', taskController.getAllRestaurants);
router.get('/restaurant/getUser', taskController.getRestaurantUser);

module.exports = router;