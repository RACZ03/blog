'use strict'

//Requires
	var express = require('express');
	var bodyParser = require('body-parser');
//Ejecutar express
	var app = express();
//Cargar archivos de rutas
	var user_routes = require('./routes/user');
	var category_routes = require('./routes/category');
	var service_routes = require('./routes/service');
	var news_routes = require('./routes/news');
//Middlewares
	app.use(bodyParser.urlencoded({extended:false}));
	app.use(bodyParser.json());
// CORS
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
//reescribir Rutas
	app.use('/api', user_routes);
	app.use('/api', category_routes);
	app.use('/api', service_routes);
	app.use('/api', news_routes);
//Exportar modulo
module.exports = app;