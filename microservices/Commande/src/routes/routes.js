const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controllers');

router.get('/order/get', Controller.getOrder);
router.get('/order/get/status', Controller.getOrderStatus);

router.post('/order/confirm', Controller.createOrder);
router.post('/order/assign', Controller.assigneLivreur);
router.post('/order/set-status',Controller.updateStatus);
module.exports = router;