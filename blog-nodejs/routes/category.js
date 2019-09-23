'use strict'

var express = require('express');
var CategoryController = require('../controllers/category');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');
//Rutas de categoria
	router.post('/category', md_auth.authenticated , CategoryController.save);
	router.put('/category/update/:id', md_auth.authenticated , CategoryController.update);
	router.get('/categories', md_auth.authenticated, CategoryController.getCategories);
	router.get('/category/:id', md_auth.authenticated, CategoryController.getCategory);
	router.delete('/category/delete/:id', md_auth.authenticated, CategoryController.deleteCategory);

//exportar rutas
module.exports = router;