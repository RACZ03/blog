'use strict'

var express = require('express');
var ServiceController = require('../controllers/service');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/services'});
//Rutas de service
	router.post('/service', md_auth.authenticated , ServiceController.save);
	router.put('/service/update/:id', md_auth.authenticated , ServiceController.update);
	router.post('/service/upload-avatar/:servicioId', [md_auth.authenticated, md_upload], ServiceController.uploadAvatar);
	router.get('/service/avatar/:fileName', md_auth.authenticated, ServiceController.avatar);
	router.get('/services', md_auth.authenticated, ServiceController.getServices);
	router.get('/service/:id', md_auth.authenticated, ServiceController.getService);
	router.delete('/service/delete/:id', md_auth.authenticated, ServiceController.deleteService);

//exportar rutas
module.exports = router;