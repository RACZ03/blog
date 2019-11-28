'use strict'

var validator = require('validator'); //Libreria para validar datos que se reciben de la web
var User = require('../models/user');//Importe del modelo Usuario

var bcrypt = require('bcrypt-nodejs');//Cifrar contraseña
var fs = require('fs');
var path = require('path');
var jwt = require('../services/jwt');//Metodo para generar token

var controller = {
	//Api rest nuevo registro
   save: function(req, res){
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
                  // Recoger los parametros de la peticion
                  var params = req.body;
                  // Validar los datos
                  try{
                     var validate_name = !validator.isEmpty(params.name);
                     var validate_surname = !validator.isEmpty(params.surname);
                     var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
                     var validate_password = !validator.isEmpty(params.password);
                     var validate_role = !validator.isEmpty(params.role);
                  }catch(err)
                  {
                     return res.status(200).send({
                        message:'Faltan datos por enviar'
                     });
                  }
                         
                  if(validate_name && validate_surname && validate_email && validate_password && validate_role){
                     // Crear objetos de usuario
                     var user = new User();
                     // Asignar valor al usuario
                     user.name = params.name;
                     user.surname = params.surname;
                     user.email = params.email.toLowerCase();
                     //Verificar el rol de usuario
                     if(params.role == "ROLE_ADMIN"){
                        user.role = params.role;   
                     }
                     else{
                        user.role = 'ROLE_USER';
                     }
                     user.image = null;
                     user.remember_token = true;
                     // Comprob ar si el usuario existe
                     User.findOne({email: user.email }, (err, issetUser) => {
                        if(err){
                           return res.status(500).send({
                              message: 'Error al comprobar el usuario'
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
                                       message: 'Error al guardar el usuario'
                                    });
                                    }
                                    if(!userStored){
                                       return res.status(500).send({
                                       message: 'El usuario no se ha guardado'
                                    });
                                    }

                                    return res.status(200).send({
                                       status: 'success',
                                       user: userStored});
                              });//Close save
                           });//Close bcrypt
                        }
                        else{
                           return res.status(500).send({
                              message: 'El usuario ya esta registrado'
                           });
                        }
                     });
                  }
                  else{
                     return res.status(200).send({
                        message: 'Validación de los datos del usuario incorrecta, intentelo de nuevo'
                     });
                  }
               }
         });         
   },

   //Api rest login
   
   login: function(req, res){
   	  //Recoger los parametros de la peticion
   	  var params = req.body;
   	  //Validar los datos
   	  try{
   			var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
   	        var validate_password = !validator.isEmpty(params.password);
   		}catch(err)
   		{
   			return res.status(200).send({
	   			message:'Faltan datos por enviar'
	   		});
   		}
   	  if(!validate_email || !validate_password){
   	  	 return res.status(200).send({
	   	  	   message: 'Los datos son incorrectos, envialos bien'
	   	  });
   	  }
   	  //Buscar usuarios que coincidan con el email y que su estado sea activo(remember_token = true)
   	  User.findOne({email: params.email.toLowerCase(), remember_token: true }, (err, user) => {
   	  	 // Si se realiza un error
   	  	  if(err){
   	  	  	return res.status(500).send({
   	  	  		message: 'Error al intentar identificarse'
   	  	  	});
   	  	  }
   	  	  //Si no lo encuentra
   	  	  if(!user){
   	  	  	 return res.status(500).send({
   	  	  		message: 'El usuario no existe'
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
                          message: 'success',
                          user
                        });
                    }
                }
                else{
                	return res.status(200).send({
			          message: 'Las credenciales no son correctas'
			    	});
                }
			   });
   	  });
   },

   //Api rest actualizar
   update: function(req, res){
   		//Recoger los datos del usuario
   		var params = req.body;
   		//Validar los datos
   		try{
   			var validate_name = !validator.isEmpty(params.name);
	   		var validate_surname = !validator.isEmpty(params.surname);
	   		var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
	   		var validate_role = !validator.isEmpty(params.role);
   		}catch(err)
   		{
   			return res.status(200).send({
	   			message:'Faltan datos por enviar'
	   		});
   		}
   		//Eliminar propiedades innecesarias
   		delete params.password;
   		delete params.created_at;

   		//Guardar en una variable el id del usuario a actualizar
   		var userId = req.user.sub;
   		//Actualizar la fecha del campo updated_At
   		params.updated_at = Date.now();

   		//Comprobar si el email es unico y si el usuario esta activo
   		if(req.user.email != params.email){
   			User.findOne({email: params.email.toLowerCase(), remember_token: true }, (err, user) => {
		   	  	 // Si se realiza un error
		   	  	  if(err){
		   	  	  	return res.status(500).send({
		   	  	  		message: 'Error al intentar identificarse'
		   	  	  	});
		   	  	  }
		   	  	  //Si no lo encuentra
		   	  	  if(user && user.email == params.email){
		   	  	  	 return res.status(200).send({
		   	  	  		message: 'El email no puede ser modificado'
		   	  	  	});
		   	  	  }
	   	  	});
   		}else{
	   		//Buscar y actualizar documentos
	   		User.findOneAndUpdate({_id: userId}, params, {new: true}, (err, userUpdated) => {
	   			if(err){
	   				return res.status(200).send({
	   					status: 'error',
			   			message: 'Error al actualizar los datos del usuario'
			   		});
	   			}
	   			if(!userUpdated){
	   				return res.status(200).send({
	   					status: 'error',
			   			message: 'No se ha actualizado los datos del usuario'
			   		});
	   			}
	   			return res.status(200).send({
	   				status: 'success',
		   			user: userUpdated
		   		});
	   		});
 		}  
   },

   //Api rest subir avatar
   uploadAvatar: function(req, res){
   	   //Configurar el modulo multiparty routes/user js
   	   //Recoger el fichero de la peticion
   	   var file_name = 'Avatar no subido...';

   	   //Comprobar si llega el archivo
   	   if(!req.files){
   	   	   //Devolver una respuesta
	   	   return res.status(404).send({
				status: 'error',
				message: file_name
			});
   	   }
   	   //Conseguir el nombre y la extencion del archivo subido
   	   var file_path = req.files.file0.path; //saca la ubicacion de la imagen
   	   var file_split = file_path.split('\\');//separar la direccion del archivo

   	   var file_name = file_split[2]; //saca el nombre  de la imagen, de la ruta

   	   //Extencion del archivo  
   	   var ext_split = file_name.split('\.');
   	   var file_ext = ext_split[1];
   	   
   	   //Comprobar extencion(solo imagenes), si no es valida borrar archivo subido
   	   if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
   	   		fs.unlink(file_path, (err) => {
   	   			return res.status(200).send({
					status: 'error',
					message: 'La extension del archivo no es valida'
				});
   	   		});
   	   }else{
   	   	   //Sacar el id del usuario identificado
	   	   var userId = req.user.sub;
	   	   //Buscar y actualizar el documento de la bd
	   	   User.findOneAndUpdate({_id: userId, remember_token: true}, {image: file_name,updated_at: Date.now()}, {new: true}, (err, userUpdated) => {
	   	   		if(err || !userUpdated){
      	   	   	//Devolver una respuesta
      			   	return res.status(500).send({
      						status: 'error',
      						message: 'Error al guardar el usuario'
      					});
	   	   		}

	   	   		//Devolver respuesta
	   	   		return res.status(200).send({
						status: 'success',
						user: userUpdated
				});
	   	   });
   	   }
   },
   //Api get Avatar
   avatar: function(req, res){
   	   //Recoger el nombre del avatar
   		var fileName = req.params.fileName;
   		var pathFile = './uploads/users/'+fileName;

   		fs.exists(pathFile, (exists) => {
   			if(exists){
   				return res.sendFile(path.resolve(pathFile));
   			}else{
   				return res.status(404).send({
   					message: 'La imagen no existe'
   				});
   			}
   		});
   },
   //Listar usuarios
   getUsers: function(req, res){
      var IdAdmin = req.params.idAdmin;
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
                   User.find({remember_token: true}).exec((err, users) => {

                        if(err || !users){
                           return res.status(404).send({
                              status: 'error',
                              message: 'No hay usuarios que mostrar'
                           }); 
                        }else{
                           
                           //Devolver respuesta
                           return res.status(200).send({
                              status: 'success',
                              users: users
                           });
                        }
                     });
               }
         });
   },

   //Listar un usuario en especifico
   getUser: function(req, res){
   		//Recoger el id del usuario
   		var userId = req.params.id;

   		User.findOne({_id: userId, remember_token: true }).exec((err, user) => {

   			if(err || !user){
   				return res.status(404).send({
   					status: 'error',
   					message: 'No existe el usuario'
   				}); 
   			}else{
   				//limpiar objeto de retorno(se quita la contraseña)
   				user.password = undefined;

   				//Devolver respuesta
   				return res.status(200).send({
   					status: 'success',
   					user: user
   				});
   			}
   		});
   },

   //Api rest Dar de baja a un usuario
   deleteUser: function(req, res){
      //id del usuario administrador
      var IdAdmin = req.params.idAdmin;
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
   	         //Recoger el id del usuario
         		var userId = req.params.id;
         	   //Buscar y actualizar el remember_token a false
      	   		User.findOneAndUpdate({_id: userId, remember_token: true}, {remember_token: false, updated_at: Date.now()}, {new: true}, (err, userUpdated) => {
      	   			if(err){
      	   				return res.status(200).send({
      	   					status: 'error',
      			   			message: 'Error al Eliminar el registro del usuario'
      			   		});
      	   			}
      	   			if(!userUpdated){
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