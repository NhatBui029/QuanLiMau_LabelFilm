const express = require('express')
const router = express.Router();
const AdminController = require('../app/controllers/AdminController');
const  middleware = require('../app/middlewares/authorization')


router.get('/addMau',middleware.requireAdmin,AdminController.getAddMau);
router.post('/addMau',middleware.requireAdmin,AdminController.addMau);
router.get('/',middleware.requireAdmin,AdminController.home);

module.exports = router;