'use strict'

//importar ORM mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
	name: String,
	surname: String,
	email: String,
	password: String,
	image: String,
	role: String,
	remember_token: Boolean,
	created_at: { type: Date, default:Date.now },
	updated_at: { type: Date, default:Date.now },
});

module.exports = mongoose.model('User', UserSchema);
			//Lowercase y pluralizar el nombre
			