'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});
//Rutas de usuario
	router.post('/user/register', UserController.save);
	router.post('/login', UserController.login);
	router.put('/user/update', md_auth.authenticated , UserController.update);
	router.post('/user/upload-avatar', [md_auth.authenticated, md_upload],UserController.uploadAvatar);
	router.get('/user/avatar/:fileName', UserController.avatar);
	router.get('/users/:idAdmin', md_auth.authenticated, UserController.getUsers);
	router.get('/user/:id', md_auth.authenticated, UserController.getUser);
	router.delete('/user/delete/:idAdmin/:id', md_auth.authenticated, UserController.deleteUser);

//exportar rutas
module.exports = router;