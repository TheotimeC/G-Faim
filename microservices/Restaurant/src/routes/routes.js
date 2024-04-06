const express = require('express');
const router = express.Router();
const taskController = require('../controllers/controllers');

router.post('/restaurant/create', taskController.createRestaurant);
router.put('/restaurant/modify',taskController.protect, taskController.majRestaurant);
router.put('/restaurant/modify/menu/:menuId',taskController.protect, taskController.majMenuDansRestaurant);
router.delete('/restaurant/delete',taskController.protect, taskController.delRestaurant);
router.get('/restaurant/get', taskController.getRestaurant);
router.get('/restaurant/getAll', taskController.getAllRestaurants);
router.get('/restaurant/getUser', taskController.getRestaurantUser);

module.exports = router;