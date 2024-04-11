const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controllers');

router.post('/user/create', Controller.createUtilisateur);
router.put('/user/modify', Controller.majUtilisateur);
router.put('/user/modify/addr', Controller.majUtilisateurAddr);
router.delete('/user/delete',Controller.protect, Controller.delUtilisateur);
router.get('/user/getId',Controller.protect, Controller.getUtilisateursId);
router.get('/user/getuserId', Controller.getUtilisateursfromid);
router.get('/user/get', Controller.getUtilisateurs);
router.get('/auth/verify', Controller.verifyApiKey);
router.post('/auth/protect', Controller.protect);
router.post('/auth/login', Controller.loginUser);
router.post('/auth/refresh', Controller.refreshTokens);

module.exports = router;