const express = require('express')
const router = express.Router();
const LoginController = require('../app/controllers/LoginController');

router.get('/',LoginController.getLogin);
router.post('/login',LoginController.login);
router.get('/logout',LoginController.logout);
router.post('/signup',LoginController.signup);

module.exports = router;