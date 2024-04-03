const express = require('express');
const router = express.Router();
const taskController = require('../controllers/controllers');

router.post('/restaurant/create', taskController.createRestaurant);
router.put('/restaurant/modify', taskController.majRestaurant);
router.delete('/restaurant/delete', taskController.delRestaurant);
router.get('/restaurant/get', taskController.getRestaurant);
router.get('/restaurant/getAll', taskController.getAllRestaurants);

module.exports = router;