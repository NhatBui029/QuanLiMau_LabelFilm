const express = require('express')
const router = express.Router();
const AdminController = require('../app/controllers/AdminController');
const  middleware = require('../app/middlewares/authorization')

router.get('/getVideo/:id',AdminController.getVideo);
router.get('/addMau',middleware.requireAdmin,AdminController.getAddMau);
router.post('/addMau',middleware.requireAdmin,AdminController.addMau);
router.get('/viewMau/:id',middleware.requireAdmin,AdminController.viewMau);
router.get('/editMau/:id',middleware.requireAdmin,AdminController.getEditMau);
router.post('/editMau/:id',middleware.requireAdmin,AdminController.editMau);
router.get('/deleteMau/:id',middleware.requireAdmin,AdminController.getDeleteMau);
router.post('/deleteMau/:id',middleware.requireAdmin,AdminController.deleteMau);
router.post('/search',middleware.requireAdmin,AdminController.search);
router.get('/',middleware.requireAdmin,AdminController.home);

module.exports = router;