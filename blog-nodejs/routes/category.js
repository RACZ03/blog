'use strict'

var express = require('express');
var CategoryController = require('../controllers/category');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');
//Rutas de categoria
	router.post('/category/register', md_auth.authenticated , CategoryController.save);
	router.put('/category/update/:id', md_auth.authenticated , CategoryController.update);
	router.get('/categories', CategoryController.getCategories);
	router.get('/category/:id', CategoryController.getCategory);
	router.delete('/category/delete/:idAdmin/:id', md_auth.authenticated, CategoryController.deleteCategory);

//exportar rutas
module.exports = router;