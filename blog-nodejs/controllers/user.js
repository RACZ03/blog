'use strict'

var validator = require('validator'); //Libreria para validar datos que se reciben de la web
var User = require('../models/user');//Importe del modelo Usuario

var bcrypt = require('bcrypt-nodejs');//Cifrar contraseña
var jwt = require('../services/jwt');//Metodo para generar token

var controller = {
	//Api rest nuevo registro
   save: function(req, res){
   		// Recoger los parametros de la peticion
   		var params = req.body;
   		// Validar los datos
   		var validate_name = !validator.isEmpty(params.name);
   		var validate_surname = !validator.isEmpty(params.surname);
   		var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
   		var validate_password = !validator.isEmpty(params.password);
   		var validate_role = !validator.isEmpty(params.role);
   		
   		if(validate_name && validate_surname && validate_email && validate_password && validate_role){
   			// Crear objetos de usuario
   			var user = new User();
	   		// Asignar valor al usuario
	   		user.name = params.name;
	   		user.surname = params.surname;
	   		user.email = params.email.toLowerCase();
	   		user.role = 'ROLE_USER';
	   		user.image = null;
	   		user.remember_token = true;
	   		// Comprob ar si el usuario existe
	   		User.findOne({email: user.email }, (err, issetUser) => {
	   			if(err){
	   				return res.status(500).send({
			   			message: "Error al comprobar el usuario"
			   		});
	   			}
	   			if(!issetUser){
	   				// Si no existe, cifrar la contraseña
	   				bcrypt.hash(params.password, null, null, (err, hash) => {
	   					user.password = hash;

	   					// Guardar usuarios
	   					user.save((err, userStored) => {
	   						if(err){
				   				return res.status(500).send({
						   			message: "Error al guardar el usuario"
						   		});
	   			            }
	   			            if(!userStored){
	   			            	return res.status(500).send({
						   			message: "El usuario no se ha guardado"
						   		});
	   			            }

	   			            return res.status(200).send({
	   			            	status: 'success',
	   			            	user: userStored});
	   					});
				   		// Devolver respuesta
				   		return res.status(200).send({
				   			message: "El usuario no esta registrado",
				   			user
				   		});
	   				});
	   			}
	   			else{
	   				return res.status(500).send({
			   			message: "El usuario ya esta registrado"
			   		});
	   			}
	   		});
   		}
   		else{
   			return res.status(200).send({
	   			message: "Validación de los datos del usuario incorrecta, intentelo de nuevo"
	   		});
   		}   		
   },

   //Api rest login
   
   login: function(req, res){
   	  //Recoger los parametros de la peticion
   	  var params = req.body;
   	  //Validar los datos
   	  var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
   	  var validate_password = !validator.isEmpty(params.password);
   	  if(!validate_email || !validate_password){
   	  	 return res.status(200).send({
	   	  	   message: "Los datos son incorrectos, envialos bien"
	   	  });
   	  }
   	  //Buscar usuarios que coincidan con el email y que su estado sea activo(remember_token = true)
   	  User.findOne({email: params.email.toLowerCase(), remember_token: true }, (err, user) => {
   	  	 // Si se realiza un error
   	  	  if(err){
   	  	  	return res.status(500).send({
   	  	  		message: "Error al intentar identificarse"
   	  	  	});
   	  	  }
   	  	  //Si no lo encuentra
   	  	  if(!user){
   	  	  	 return res.status(500).send({
   	  	  		message: "El usuario no existe"
   	  	  	});
   	  	  }
   	  	  //Si lo encuentra,
	   	  //Comprobar la contraseña (Coincidencia de email y password - bcrypt)
	   	  bcrypt.compare(params.password, user.password, (err, check) => {
                //Si es correcto
                if(check){
                	//Generar token de jwt y dev
                	if(params.gettoken)
                    {
                        //Devolver los datos
                        return res.status(200).send({
                          token: jwt.createToken(user)
                        });
                    }
                    else{
                        //Limpiar el objeto(datos que no se envian en la peticion)
                        user.password = undefined;
                        user.created_at = undefined;
                        user.updated_at = undefined;
                        user.remember_token = undefined;
                        //Devolver los datos
                        return res.status(200).send({
                          message: "success",
                          user
                        });
                    }
                }
                else{
                	return res.status(200).send({
			          message: "Las credenciales no son correctas"
			    	});
                }
			});
   	  });
   },

   //Api rest actualizar
   update: function(req, res){
   		return res.status(200).send({
   			message:"Metodo Actualizar"
   		})
   }

};

module.exports = controller;