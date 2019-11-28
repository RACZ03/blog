'use strict'
var validator = require('validator');
var User = require('../models/user');
var fs = require('fs');
var path = require('path');
var Portafolio = require('../models/portafolio');

var controller = {
   //Api rest nuevo portafolio
   save: function(req, res){
      //Recoger los parametros por post
        var params = req.body;
        //Validar datos
        try{
          var validate_title = !validator.isEmpty(params.title);
          var validate_description = !validator.isEmpty(params.description);
          var validate_image = !validator.isEmpty(params.image);
        }catch(err){
        return res.status(200).send({
            message:'Faltan datos por enviar, intente nuevamente'
            });
        }
       
         //Validar si los campos vienen true
        if(validate_title && validate_description){
          
          //Validar que el portafolio no exista
           Portafolio.findOne({title: params.title }, (err, issetPortafolio) => {
             if(err){
               return res.status(500).send({
                 message: 'Error al comprobar el portafolio'
               });
             }//Si no existe el servicio
             if(!issetPortafolio){

              //Crear objetos a guardar
              var portafolio = new Portafolio();
              //Asignar valores 
              portafolio.title = params.title;
              portafolio.description = params.description;
              portafolio.image = params.image;
              portafolio.user_id = req.user.sub;
              portafolio.remember_token = true;
              //Guardar Service
              portafolio.save((err, portafolioStored) => {
                if(err || !portafolioStored){
                  return res.status(404).send({
                    status:'error',
                    message:'El portafolio no se ha guardado'
                    });
                }
                //Devolver una respuesta
                return res.status(200).send({
                  status:'success',
                  portafolio: portafolioStored
                });
              });//Fin del Save
            }
             else{//Fin validacion si existe el servivio que se quiere guardar
               return res.status(500).send({
                 message: 'El portafolio ya esta registrada'
               });
             }
           });
        }else{
          return res.status(200).send({
            message:'Los datos no son validos'
          });
        }
    },

    //Api rest actualizar
    update: function(req, res){
        //Recoger el Id de la categoria
        var portafolioId = req.params.id;
        //Recoger los datos que llegan desde post
        var params = req.body;
        //Validar la informacion
        try{
			  var validate_title = !validator.isEmpty(params.title);
			  var validate_description = !validator.isEmpty(params.description);
        }catch(err){
            return res.status(200).send({
              message:'Faltan datos por enviar, intente nuevamente'
            });
        }

        if(validate_title && validate_description)
        {
          //Montar in json con los datos modificables
          var update = {
			      title: params.title,
			      description: params.description,
            image: params.image,
            updated_at: Date.now()
          }
          //Find and Update de la categoria por id y si el estado sea true
          Portafolio.findOneAndUpdate({_id: portafolioId, remember_token: true}, update, {new:true}, (err , portafolioUpdated) => {
              //Comprobar si llega un error
              if(err)
              {
                  return res.status(500).send({
                      status:'error',
                      message:'Error en la peticion'
                  });
              }
              if(!portafolioUpdated)
              {
                  return res.status(404).send({
                      status:'error',
                      message:'No se ha actualizado el portafolio'
                  });
              }
              //Devolver una respuesta
              return res.status(200).send({
                  status:'success',
                  portafolio: portafolioUpdated
              });
          });
        }else{
            //Devolver una respuesta
            return res.status(200).send({
                message:'La validacion de los datos no es correcta'
            });
        }
    },

    //Api rest subir avatar
   uploadAvatar: function(req, res){
   	   //Configurar el modulo multiparty routes/portafolio js
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

	   	   		//Devolver respuesta
	   	   		return res.status(200).send({
						status: 'success',
						image: file_name
				      });
   	   }
   },
   //Api get Avatar
   avatar: function(req, res){
   	   //Recoger el nombre del avatar
   		var fileName = req.params.fileName;
   		var pathFile = './uploads/portafolio/'+fileName;

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

   //Listar portafolio
   getPortafolios: function(req, res){
   		Portafolio.find({remember_token: true})
   				.populate('category_id')
   				.exec((err, portafolios) => {

   			if(err || !portafolios){
   				return res.status(404).send({
   					status: 'error',
   					message: 'No hay portafolios que mostrar'
   				}); 
   			}else{
   				
   				//Devolver respuesta
   				return res.status(200).send({
   					status: 'success',
   					portafolios: portafolios
   				});
   			}
   		});
   },

   //Listar un portafolio en especifico
   getPortafolio: function(req, res){
   		//Recoger el id del portafolio
   		var portafolioId = req.params.id;

   		Portafolio.findOne({_id: portafolioId, remember_token: true }).exec((err, portafolio) => {

   			if(err || !portafolio){
   				return res.status(404).send({
   					status: 'error',
   					message: 'No existe el portafolio'
   				}); 
   			}else{

   				//Devolver respuesta
   				return res.status(200).send({
   					status: 'success',
   					portafolio: portafolio
   				});
   			}
   		});
   },

   //Api rest Dar de baja a un portafolio
   deletePortafolio: function(req, res){
      //Id del usuario Administrador
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
               		var portafolioId = req.params.id;
               	   //Buscar y actualizar el remember_token a false
            	   		Portafolio.findOneAndUpdate({_id: portafolioId, remember_token: true}, {remember_token: false, updated_at: Date.now()}, {new: true}, (err, portafolioUpdated) => {
            	   			if(err){
            	   				return res.status(200).send({
            	   					status: 'error',
            			   			message: 'Error al eliminar el registro del portafolio'
            			   		});
            	   			}
            	   			if(!portafolioUpdated){
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