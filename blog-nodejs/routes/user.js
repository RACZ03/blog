'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var router = express.Router();

//Rutas de usuario
	router.post('/register', UserController.save);
	router.post('/login', UserController.login);
	router.put('/update', UserController.update);

//exportar rutas
module.exports = router;