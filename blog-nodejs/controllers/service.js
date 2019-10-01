'use strict'
var validator = require('validator');
var fs = require('fs');
var path = require('path');
var Service = require('../models/service');
var Category = require('../models/category');

var controller = {
    save: function(req, res){
    	//Recoger los parametros por post
    	var params = req.body;
    	//Validar datos
    	try{
  			var validate_title = !validator.isEmpty(params.title);
  			var validate_content = !validator.isEmpty(params.content);
  			var validate_categoryId = !validator.isEmpty(params.category_id);
    	}catch(err){
			    return res.status(200).send({
    		      message:'Faltan datos por enviar, intente nuevamente'
    	    });
    	}
   	
	   	//Validar si los campos vienen true
	    if(validate_title && validate_content && validate_categoryId){
	    	
	    	//Validar que el servicio no exista
	   		Service.findOne({title: params.title }, (err, issetService) => {
		   		if(err){
		   			return res.status(500).send({
				   		message: 'Error al comprobar el servicio'
				   	});
		   		}//Si no existe el servicio
		   		if(!issetService){

			    	//Validar si la categoria existe
			    	Category.findOne({_id: params.category_id, remember_token: true }).exec((err, category) => {	    	
				    	if(err || !category){
			   				return res.status(404).send({
			   					status: 'error',
			   					message: 'No existe el categoria'
			   				}); 
			   			}else{
					    	//Crear objetos a guardar
					    	var service = new Service();
					    	//Asignar valores 
					    	service.title = params.title;
					    	service.content = params.content;
					    	service.image = params.image;
					    	service.category_id = params.category_id;
					    	service.user_id = req.user.sub;
					    	service.remember_token = true;
					    	//Guardar Service
					    	service.save((err, serviceStored) => {
					    		if(err || !serviceStored){
					    			return res.status(404).send({
							    		status:'error',
							    		message:'El servicio no se ha guardado'
						    	    });
					    		}
					    		//Devolver una respuesta
						    	return res.status(200).send({
						    		status:'success',
						    		service: serviceStored
						    	});
					    	});//Fin del Save
				    	}
			       });//Fin de la validacion si existe la categoria
			    }
		   		else{//Fin validacion si existe el servivio que se quiere guardar
		   			return res.status(500).send({
				   		message: 'El servicio ya esta registrado'
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
        //Recoger el Id del servicio
        var servicioId = req.params.id;
        
        //Recoger los datos que llegan desde post
        var params = req.body;
        //Validar la informacion
        try{
          var validate_title = !validator.isEmpty(params.title);
          var validate_content = !validator.isEmpty(params.content);
          var validate_categoryId = !validator.isEmpty(params.category_id);
        }catch(err){
            return res.status(200).send({
                message:'Faltan datos por enviar, intente nuevamente'
            });
        }

        if(validate_title && validate_content)
        {

          //Montar in json con los datos modificables
          var update = {
              title: params.title,
              content: params.content,
              image: params.image,
              category_id: params.category_id,
              updated_at: Date.now()
          }
          //Find and Update de la categoria por id y si el estado sea true
          Service.findOneAndUpdate({_id: servicioId, remember_token: true}, update, {new:true}, (err , serviceUpdated) => {
              //Comprobar si llega un error
              if(err)
              {
                  return res.status(500).send({
                      status:'error',
                      message:'Error en la peticion'
                  });
              }
              if(!serviceUpdated)
              {
                  return res.status(404).send({
                      status:'error',
                      message:'No se ha actualizado el servicio'
                  });
              }
              //Devolver una respuesta
              return res.status(200).send({
                  status:'success',
                  service: serviceUpdated
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
   		var pathFile = './uploads/services/'+fileName;

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

   //Listar servicios
   getServices: function(req, res){
   		Service.find({remember_token: true})
   				.populate('category_id')
   				.exec((err, services) => {

   			if(err || !services){
   				return res.status(404).send({
   					status: 'error',
   					message: 'No hay servicios que mostrar'
   				}); 
   			}else{
   				
   				//Devolver respuesta
   				return res.status(200).send({
   					status: 'success',
   					services: services
   				});
   			}
   		});
   },

   //Listar un usuario en especifico
   getService: function(req, res){
   		//Recoger el id del usuario
   		var serviceId = req.params.id;

   		Service.findOne({_id: serviceId, remember_token: true }).exec((err, service) => {

   			if(err || !service){
   				return res.status(404).send({
   					status: 'error',
   					message: 'No existe el servicio'
   				}); 
   			}else{

   				//Devolver respuesta
   				return res.status(200).send({
   					status: 'success',
   					service: service
   				});
   			}
   		});
   },

   //Api rest Dar de baja a un usuario
   deleteService: function(req, res){

   	   //Recoger el id del usuario
   		var serviceId = req.params.id;
   	   //Buscar y actualizar el remember_token a false
	   		Service.findOneAndUpdate({_id: serviceId, remember_token: true}, {remember_token: false, updated_at: Date.now()}, {new: true}, (err, serviceUpdated) => {
	   			if(err){
	   				return res.status(200).send({
	   					status: 'error',
			   			message: 'Error al eliminar el registro del servicio'
			   		});
	   			}
	   			if(!serviceUpdated){
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
};

module.exports = controller;