const express = require('express')
const router = express.Router();
const ClientController = require('../app/controllers/ClientController');
const  middleware = require('../app/middlewares/authorization')

router.post('/tracuu',middleware.requireUser,ClientController.traCuu);
router.get('/',middleware.requireUser,ClientController.home);

module.exports = router;