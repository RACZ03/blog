'use strict'

//importar ORM mongoose
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var Schema = mongoose.Schema;

var PostSchema = Schema({
	user_id: { type: Schema.ObjectId, ref:'User' },
	title: String,
	content: String,
	image: String,
	remember_token: Boolean,
	created_at: { type: Date, default:Date.now },
	updated_at: { type: Date, default:Date.now },
});

//Carga Paginacion
    PostSchema.plugin(mongoosePaginate);
	module.exports = mongoose.model('Post', PostSchema);
	                                //lowercase y pluralizar el nombre
	                                //users -> documentos(schema)