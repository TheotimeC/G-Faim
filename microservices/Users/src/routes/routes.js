const express = require('express');
const router = express.Router();
const taskController = require('../controllers/controllers');

router.post('/user/create', taskController.createUtilisateur);
router.put('/user/modify', taskController.majUtilisateur);
router.delete('/user/delete', taskController.delUtilisateur);
router.get('/user/get', taskController.getUtilisateurs);

module.exports = router;