'user strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = "clave-secreta-para-generar-el-token-2019";

exports.authenticated = function(req, res, next){
    //Comprobar si lleg autorizacion
    if(!req.headers.authorization){
       return res.status(403).send({
 			message: 'La peticion no tiene la Cabecera de authorization'
       });
    }
    //Limpiar el token y quitar comillas
    var token = req.headers.authorization.replace(/['"]+/g, '');
    //Decodificar el token
    try{	
    	var payload = jwt.decode(token, secret);
    	//Comprobar si el token a espirado
    	if(payload.exp <= moment.unix())
    	{
           return res.status(403).send({
 			message: 'El token ha expirado'
           });   
    	}
    }catch(ex){
    	return res.status(403).send({
 			message: 'El token no es valido'
       });
    }
    
    //Adjuntar usuario identificado a la request
    req.user = payload;
    //Pasar a la accion
    next();
};