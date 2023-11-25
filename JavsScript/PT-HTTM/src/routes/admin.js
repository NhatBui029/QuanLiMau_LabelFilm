const express = require('express')
const router = express.Router();
const AdminController = require('../app/controllers/AdminController');
const middleware = require('../app/middlewares/authorization')

router.get('/addMau', middleware.requireAdmin, AdminController.getAddMau);
router.post('/addMau', middleware.requireAdmin, AdminController.addMau);
router.get('/addLabel/:id1/:id2', middleware.requireAdmin, AdminController.addLabel);
router.get('/viewFrame/:id1/:id2', middleware.requireAdmin, AdminController.viewFrame);
router.get('/editLabel/:id1/:id2/:id3', middleware.requireAdmin, AdminController.editLabel);
router.get('/deleteFrame/:id1/:id2', middleware.requireAdmin, AdminController.deleteFrame);
router.get('/deleteLabel/:id1/:id2/:id3', middleware.requireAdmin, AdminController.deleteLabel);
router.get('/getVideo/:id', middleware.requireAdmin, AdminController.getVideo);
router.get('/getImage/:id1/:id2', middleware.requireAdmin, AdminController.getImage);
router.get('/viewMau/:id', middleware.requireAdmin, AdminController.viewMau);
router.get('/deleteMau/:id', middleware.requireAdmin, AdminController.getDeleteMau);
router.post('/deleteMau/:id', middleware.requireAdmin, AdminController.deleteMau);
router.post('/search', middleware.requireAdmin, AdminController.search);
router.get('/', middleware.requireAdmin, AdminController.home);

module.exports = router;