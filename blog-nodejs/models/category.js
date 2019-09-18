'use strict'

//importar ORM mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = Schema({
	name: String,
	remember_token: Boolean,
	created_at: { type: Date, default:Date.now },
	updated_at: { type: Date, default:Date.now },
});

module.exports = mongoose.model('Category', CategorySchema);
			//Lowercase y pluralizar el nombre
			