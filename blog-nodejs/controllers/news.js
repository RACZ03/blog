'use strict'
var validator = require('validator');
var News = require('../models/news');
var fs = require('fs');
var path = require('path');

var controller = {
	//Api rest Guardar noticia
	 save: function(req, res){
    	//Recoger los parametros por post
    	var params = req.body;
    	//Validar datos
    	try{
  			var validate_title = !validator.isEmpty(params.title);
  			var validate_content = !validator.isEmpty(params.content);
    	}catch(err){
			return res.status(200).send({
    		  message:'Faltan datos por enviar, intente nuevamente'
    	    });
    	}
   	
	   	//Validar si los campos vienen true
	    if(validate_title && validate_content){
	    	
	    	//Validar que la noticia no exista
	   		News.findOne({title: params.title }, (err, issetNews) => {
		   		if(err){
		   			return res.status(500).send({
				   		message: 'Error al comprobar la noticia'
				   	});
		   		}//Si no existe el servicio
		   		if(!issetNews){

			    	//Crear objetos a guardar
			    	var news = new News();
			    	//Asignar valores 
			    	news.title = params.title;
			    	news.content = params.content;
			    	news.image = null;
			    	news.user_id = req.user.sub;
			    	news.remember_token = true;
			    	//Guardar Service
			    	news.save((err, newsStored) => {
			    		if(err || !newsStored){
			    			return res.status(404).send({
					    		status:'error',
					    		message:'La noticia no se ha guardado'
				    	    });
			    		}
			    		//Devolver una respuesta
				    	return res.status(200).send({
				    		status:'success',
				    		news: newsStored
				    	});
			    	});//Fin del Save
			    }
		   		else{//Fin validacion si existe el servivio que se quiere guardar
		   			return res.status(500).send({
				   		message: 'La noticia ya esta registrada'
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
        //Recoger el Id de la noticia
        var newId = req.params.id;
        
        //Recoger los datos que llegan desde post
        var params = req.body;
        //Validar la informacion
        try{
            var validate_title = !validator.isEmpty(params.title);
  			var validate_content = !validator.isEmpty(params.content);
        }catch(err){
            return res.status(200).send({
              message:'Faltan datos por enviar, intente nuevamente'
            });
        }

        if(validate_title && validate_content)
        {
		
	    	//Validar que la noticia no exista
	   		News.findOne({title: params.title }, (err, issetNews) => {
		   		if(err){
		   			return res.status(500).send({
				   		message: 'Error al comprobar la noticia'
				   	});
		   		}//Si no existe el noticia
		   		if(!issetNews){

		            //Montar in json con los datos modificables
		            var update = {
		                title: params.title,
		                content: params.content,
		                updated_at: Date.now()
		            }
		            //Find and Update de la noticia por id y si el estado sea true
		            News.findOneAndUpdate({_id: newId, remember_token: true}, update, {new:true}, (err , newsUpdated) => {
		                //Comprobar si llega un error
		                if(err)
		                {
		                    return res.status(500).send({
		                        status:'error',
		                        message:'Error en la peticion'
		                    });
		                }
		                if(!newsUpdated)
		                {
		                    return res.status(404).send({
		                        status:'error',
		                        message:'No se ha actualizado la noticia'
		                    });
		                }
		                //Devolver una respuesta
		                return res.status(200).send({
		                    status:'success',
		                    news: newsUpdated
		                });
		            });
		        }
		        else{//Fin validacion si existe el servivio que decea actualizar ya existe
		   			return res.status(500).send({
				   		message: 'La noticia ya esta registrado'
				   	});
		   		}
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
   	   //Configurar el modulo multiparty routes/news js
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
   	   	   //Recoger el Id del topic
           var newsId = req.params.newsId;
	   	   //Buscar y actualizar el documento de la bd
	   	   News.findOneAndUpdate({_id: newsId, remember_token: true}, {image: file_name,updated_at: Date.now()}, {new: true}, (err, newsUpdated) => {
	   	   		if(err || !newsUpdated){
      	   	   	//Devolver una respuesta
      			   	return res.status(500).send({
      						status: 'error',
      						message: 'Error al guardar la noticia'
      					});
	   	   		}

	   	   		//Devolver respuesta
	   	   		return res.status(200).send({
						status: 'success',
						news: newsUpdated
				});
	   	   });
   	   }
   },
   //Api get Avatar
   avatar: function(req, res){
   	   //Recoger el nombre del avatar
   		var fileName = req.params.fileName;
   		var pathFile = './uploads/news/'+fileName;

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

   //Api rest Dar de baja a una noticia
   deleteNews: function(req, res){

   	   //Recoger el id de la noticia
   		var newsId = req.params.id;
      	   //Buscar y actualizar el remember_token a false
	   		News.findOneAndUpdate({_id: newsId, remember_token: true}, {remember_token: false, updated_at: Date.now()}, {new: true}, (err, newsUpdated) => {
	   			if(err){
	   				return res.status(200).send({
	   					status: 'error',
			   			message: 'Error al eliminar el registro de la noticia'
			   		});
	   			}
	   			if(!newsUpdated){
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
   },
   //Api rest lista noticias
   getNews: function(req, res){
    	//Cargar la libreria de paginacion en la clase
    	//Recoger la pagina actual
    	if(!req.params.page || req.params.page == 0 || req.params.page == "0" || req.params.page == null || req.params.page == undefined){
    		var page = 1;
    	}
    	else{
    	   var page = parseInt(req.params.page);
        }
    	//Indicar las opciones de paginacion
    	var options = {
    		sort: {date: -1},
    		populate: ('user_id'),
    		limit: 2,
    		page: page
    	}

    	//Find paginado
    	News.paginate({remember_token: true}, options, (err, news) => {
    		if(err){
	    		return res.status(500).send({
		    		status:'error',
		    		message:'Error al hacer la consulta'
		    	});
    		}
    		if(!news){
	    		return res.status(404).send({
		    		status:'notfound',
		    		message:'No hay noticias'
		    	});
    		}

    		//Devolver resultado(noticias, total de noticias, total de paginas)
	    	return res.status(200).send({
	    		status:'success',
	    		news: news.docs,
	    		totalDocs: news.totalDocs,
	    		totalPages: news.totalPages
	    	});
    	});
    	
    },

    //Api rest noticias por usuarios
    getNewsByUser:function(req, res){
    	//Conseguir el id del usuario
    	var userId = req.params.user;
    	//Find con la condicion del usuario
    	News.find({
    		user_id: userId,
    		remember_token: true
    	})
    	.populate('user_id', 'name surname image')
    	.sort([['date', 'descending']])
    	.exec((err, news) => {
    		if(err)
    		{
                 //Devolver resultado
		    	return res.status(500).send({
		    		status:'error',
		    		message:'Error en la peticion'
		    	});
    		}
    		if(!news)
    		{
                 //Devolver resultado
		    	return res.status(404).send({
		    		status:'error',
		    		message:'No hay noticias para mostrar'
		    	});
    		}
    		
			//Devolver resultado
	    	return res.status(200).send({
	    		status:'success',
	    		news: news
	    	});
    		
    	});
    	
    },
    //Api rest noticia por id
    getNew: function(req, res){
    	//Sacar el id del noticia de la url
    	var newsId = req.params.id;
    	    	//Find por id del noticia
    	News.find({
    		_id: newsId,
    		remember_token: true
    		})
    		 .populate('user_id', 'name surname image')
    		 .exec((err, news) => {
    		 	if(err){
	                return res.status(500).send({
	                	status:'error',
			    		message: 'Error en la peticion'
			    	});
    		 	}
    		 	if(!news){
	                return res.status(404).send({
	                	status:'error',
			    		message: 'No existe la noticia'
			    	});
    		 	}
		    	return res.status(200).send({
		    		status:'success',
		    		news: news
		    	});
    	 });
    },
    search: function(req, res){
        //Sacar string a buscar de la url
        var searchString = req.params.search;
        //Find or
        News.find({ "$or": [
                {"title": {"$regex": searchString, "$options": "i"} },
                {"content": {"$regex": searchString, "$options": "i"} },
            ],remember_token: true})
            .populate('user_id', 'name surname image')
            .sort([['date', 'descending']])
            .exec((err, news) => {
                 if(err){
                     //Devolver una respuesta
                    return res.status(500).send({
                        status:'error',
                        message:'Error en la peticion'
                    });
                 }
                 if(!news){
                     //Devolver una respuesta
                    return res.status(404).send({
                        status:'error',
                        message:'No hay noticias disponible'
                    });
                 }

                 //Devolver una respuesta
                return res.status(200).send({
                    status:'success',
                    news: news
                });
            });
          
    }
};

module.exports = controller;