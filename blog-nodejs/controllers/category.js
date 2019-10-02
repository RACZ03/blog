'use strict'

var validator = require('validator'); //Libreria para validar datos que se reciben de la web
var Category = require('../models/category');//Importe del modelo Category
var User = require('../models/user');//Importe de modelo User 
var jwt = require('../services/jwt');//Metodo para generar token

var controller = {
	//Api rest nueva categoria
   save: function(req, res){
     		// Recoger los parametros de la peticion
     		var params = req.body;
     		// Validar los datos
     		try{
     			var validate_name = !validator.isEmpty(params.name);
     		}catch(err)
     		{
     			return res.status(200).send({
  	   			message:'Faltan datos por enviar'
  	   		});
     		}
     		 		
     		if(validate_name){
     			// Crear objeto de la categoria
     			var category = new Category();
  	   		// Asignar valor a la categoria
  	   		category.name = params.name;
  	   		category.remember_token = true;
  	   		// Comprob ar si la categoria	 existe
  	   		Category.findOne({name: category.name }, (err, issetCategory) => {
  	   			if(err){
  	   				return res.status(500).send({
  			   			message: 'Error al comprobar la categoria'
  			   		});
  	   			}
  	   			if(!issetCategory){
  	   					// Guardar categoria
  	   					category.save((err, categoryStored) => {
  	   						if(err){
  				   				return res.status(500).send({
  						   			message: 'Error al guardar la categoria'
  						   		});
  	   			            }
  	   			            if(!categoryStored){
  	   			            	return res.status(500).send({
  						   			message: 'La categoria no se ha guardado'
  						   		});
  	   			            }

  	   			            return res.status(200).send({
  	   			            	status: 'success',
  	   			            	category: categoryStored});
  	   					});//Close save
  	   			}
  	   			else{
  	   				return res.status(500).send({
  			   			message: 'La categoria ya esta registrada'
  			   		});
  	   			}
  	   		});
     		}
     		else{
     			return res.status(200).send({
  	   			message: 'Validación de los datos del usuario incorrecta, intentelo de nuevo'
  	   		});
     		} 		
   },

   //Api rest actualizar
   update: function(req, res){
        //Recoger el Id de la categoria
        var categoryId = req.params.id;
        //Recoger los datos que llegan desde post
        var params = req.body;
        //Validar la informacion
        try{
              var validate_name = !validator.isEmpty(params.name);
        }catch(err){
            return res.status(200).send({
              message:'Faltan datos por enviar, intente nuevamente'
            });
        }

        if(validate_name)
        {
          //Montar in json con los datos modificables
          var update = {
              name: params.name,
              updated_at: Date.now()
          }
          //Find and Update de la categoria por id y si el estado sea true
          Category.findOneAndUpdate({_id: categoryId, remember_token: true}, update, {new:true}, (err , categoryUpdated) => {
              //Comprobar si llega un error
              if(err)
              {
                  return res.status(500).send({
                      status:'error',
                      message:'Error en la peticion'
                  });
              }
              if(!categoryUpdated)
              {
                  return res.status(404).send({
                      status:'error',
                      message:'No se ha actualizado la categoria'
                  });
              }
              //Devolver una respuesta
              return res.status(200).send({
                  status:'success',
                  category: categoryUpdated
              });
          });
        }else{
            //Devolver una respuesta
            return res.status(200).send({
                message:'La validacion de los datos no es correcta'
            });
        }
    },

    //Listar categorias
   getCategories: function(req, res){
   		Category.find({remember_token: true}).exec((err, categories) => {

   			if(err || !categories){
   				return res.status(404).send({
   					status: 'error',
   					message: 'No hay categorias que mostrar'
   				}); 
   			}else{
   				
   				//Devolver respuesta
   				return res.status(200).send({
   					status: 'success',
   					categories: categories
   				});
   			}
   		});
   },

   //Listar una categoria en especifico
   getCategory: function(req, res){
   		//Recoger el id de la categoria
   		var categoryId = req.params.id;

   		Category.findOne({_id: categoryId, remember_token: true }).exec((err, category) => {

   			if(err || !category){
   				return res.status(404).send({
   					status: 'error',
   					message: 'No existe la categoria'
   				}); 
   			}else{
   				//Devolver respuesta
   				return res.status(200).send({
   					status: 'success',
   					category: category
   				});
   			}
   		});
   },

   //Api rest Dar de baja a un categoria
   deleteCategory: function(req, res){
      //Id del usuario Administrador
     var IdAdmin = req.params.idAdmin;
         console.log(IdAdmin);
         //Validar Que el usuario sea administrador
         User.findOne({_id:IdAdmin, role: "ROLE_ADMIN", remember_token: true}).exec((err, user) => {
               if(err || !user){
                     //Devolver una respuesta
                     return res.status(500).send({
                        status: 'error',
                        message: 'Acceso denegado'
                  });
               }
               else{
               	   //Recoger el id del categoria
               		var categoryId = req.params.id;
               	   //Buscar y actualizar el remember_token a false
            	   		Category.findOneAndUpdate({_id: categoryId, remember_token: true}, {remember_token: false, updated_at: Date.now()}, {new: true}, (err, categoryUpdated) => {
            	   			if(err){
            	   				return res.status(200).send({
            	   					status: 'error',
            			   			message: 'Error al Eliminar el registro de la categoria'
            			   		});
            	   			}
            	   			if(!categoryUpdated){
            	   				return res.status(200).send({
            	   					status: 'error',
            			   			message: 'No existe el registro'
            			   		});
            	   			}
            	   			return res.status(200).send({
            	   				status: 'success',
            		   			message: 'Registro eliminado correctamente'
            		   		});
            	   		});
                }
        });
   }
};

module.exports = controller;