'use strict'

var express = require('express');
var PortafolioController = require('../controllers/portafolio');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/portafolio'});
//Rutas de portafolio
	router.post('/portafolio/register', md_auth.authenticated,PortafolioController.save);
	router.put('/portafolio/update/:id', md_auth.authenticated, PortafolioController.update);
	router.post('/portafolio/upload-avatar', [md_auth.authenticated, md_upload], PortafolioController.uploadAvatar);
	router.get('/portafolio/avatar/:fileName', PortafolioController.avatar);
	router.get('/portafolios', PortafolioController.getPortafolios);
	router.get('/portafolio/:id', PortafolioController.getPortafolio);
	router.delete('/portafolio/delete/:idAdmin/:id', md_auth.authenticated, PortafolioController.deletePortafolio);

//exportar rutas
module.exports = router;