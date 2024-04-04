const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controllers');

router.post('/user/create', Controller.createUtilisateur);
router.put('/user/modify',Controller.protect, Controller.majUtilisateur);
router.delete('/user/delete',Controller.protect, Controller.delUtilisateur);
router.get('/user/get',Controller.protect, Controller.getUtilisateurs);
router.get('/user/getId',Controller.protect, Controller.getUtilisateursId);

router.post('/auth/login', Controller.loginUser);
router.post('/auth/login', Controller.loginUser);

module.exports = router;