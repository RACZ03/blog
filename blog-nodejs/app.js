'use strict'

//Requires
	var express = require('express');
	var bodyParser = require('body-parser');
//Ejecutar express
	var app = express();
//Cargar archivos de rutas
//Middlewares
	app.use(bodyParser.urlencoded({extended:false}));
	app.use(bodyParser.json());
//CORS
//reescribir Rutas
//Exportar modulo
module.exports = app;