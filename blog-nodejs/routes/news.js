'use strict'

var express = require('express');
var NewsController = require('../controllers/news');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/news'});
//Rutas de noticias
	router.post('/news/register', md_auth.authenticated , NewsController.save);
	router.put('/news/update/:id', md_auth.authenticated , NewsController.update);
	router.post('/news/upload-avatar', [md_auth.authenticated, md_upload], NewsController.uploadAvatar);
	router.get('/news/avatar/:fileName', NewsController.avatar);
	router.delete('/news/delete/:id', md_auth.authenticated, NewsController.deleteNews);

	router.get('/news/list/:page?',NewsController.getNews);
	router.get('/news',NewsController.getListNews);
	router.get('/news/:_id',NewsController.getNew);
	router.get('/news/search/:search',NewsController.search);

//exportar rutas
module.exports = router;