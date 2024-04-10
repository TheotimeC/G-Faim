const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controllers');

router.post('/logs/create', Controller.createLog); 
router.get('/logs', Controller.getLogs);

module.exports = router;