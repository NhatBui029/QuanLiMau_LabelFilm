const express = require('express')
const router = express.Router();
const LoginController = require('../app/controllers/LoginController');

router.get('/',LoginController.getLogin);
router.get('/video',LoginController.video);
router.get('/getVideo/:id',LoginController.getVideo);
router.post('/login',LoginController.login);
router.post('/signup',LoginController.signup);

module.exports = router;