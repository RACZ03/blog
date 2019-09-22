'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

//Rutas de usuario
	router.post('/register', md_auth.authenticated , UserController.save);
	router.post('/login', UserController.login);
	router.put('/update', md_auth.authenticated , UserController.update);

//exportar rutas
module.exports = router;