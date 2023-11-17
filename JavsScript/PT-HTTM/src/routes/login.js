const express = require('express')
const router = express.Router();
const LoginController = require('../app/controllers/LoginController');

router.get('/',LoginController.getLogin);
router.get('/read',LoginController.read);
router.get('/upload',LoginController.upload);
router.get('/viewNhan', LoginController.viewNhan);
router.get('/viewImage/:id1/:id2', LoginController.viewImage);
router.get('/editImage/:id1/:id2', LoginController.editImage);
router.get('/getImage/:id1/:id2', LoginController.getImage);
router.post('/login',LoginController.login);
router.get('/logout',LoginController.logout);
router.post('/signup',LoginController.signup);

module.exports = router;