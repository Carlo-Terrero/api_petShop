'use strict'

var validator = require('validator');
//const { findOneAndDelete } = require('../models/user');
var User = require('../models/user')

var controller = {

    //Methodos de prueba
    datos: (req, res) => {
        return res.status(200).send({
            nombre: 'ponko',
            raza: 'perro'
        })
    },

    direc: (req, res) => {
        return res.status(200).send({
            calle: 'portalegre',
            piso: 8
        })
    },

    //Methodo guardar
    save: (req, res) => {
        var params = req.body
        
        try{

            //Validamos los datos a guardar
            var validate_nombre = !validator.isEmpty(params.nombre);
            var validate_apellido = !validator.isEmpty(params.apellido);
            var validate_email = !validator.isEmpty(params.email);
            var validate_nickName = !validator.isEmpty(params.nickName);
            var validate_password = !validator.isEmpty(params.password);
            var validator_dir = !validator.isEmpty(params.dir);

        }catch(err){

            return res.status(500).send({
                status: 'Error',
                message: 'Error de validacion'
            }) 

        }


        //Comprobamos que no este vacio y creamos el objeto
        if (validate_nombre && validate_apellido && validate_email && 
            validate_nickName && validate_password && validator_dir){

            var user = User();

            user.userName = params.nombre;
            user.userApellido = params.apellido;
            user.userEmail = params.email;
            user.userNick = params.nickName;
            user.userPassword = params.password;
            user.userDir = params.dir;

            user.save((err, userStored) => {

                if(err || !userStored){
                    return res.status(500).send({
                        status:'Error',
                        message: 'Ha habido un error al guardar el articulo'
                    });
                }

                // Devolver una respuesta
                return res.status(200).send({
                    status: 'Success',
                    article: userStored
                });
            })
        
        }else{
            return res.status(500).send({
                status: 'Error',
                message: 'Error al validar el dato'
            }) 
        }       
    },

    //Methodo optener usuarios
    getUsers: (req, res) => {

        User.find({}).sort('-_id').exec((err, users) => {

            if(err){
                return res.status(500).send({
                    status: 'success',
                    message: 'Error al extraer los datos'
                })
            }

            return res.status(200).send({
                status: 'Success',
                objeto: users
            })
        })

    },

    //methodo de validar un usuario
    userValidado: (req, res) => {
        
        var validEmail = req.params.email;
        var validPass = req.params.password;       

        if(!validEmail || !validPass || validEmail == null || validPass == null){
            return res.status(404).send({
                status: 'Error',
                message: 'Email o contraseña incorrectos'
            })
        }

        User.find({ userEmail: validEmail, userPassword: validPass}, (err, user) => {
            if(err || !user || user == false){
                return res.status(404).send({
                    status: 'error',
                    message: 'Articulo no existente'
                });
            }

            // Devolverlo en json
            return res.status(200).send({
                status: 'Success',
                user
            });
        })              
    },

    update: (req, res) => {

        User.find({}).exec((err, article) => {
            
            var userId = req.params.id;
            var params = req.body;
            console.log(params)
            try {
                
                var validate_nombre = !validator.isEmpty(params.userName);
                var validate_apellido = !validator.isEmpty(params.userApellido);
                var validate_email = !validator.isEmpty(params.userEmail);
                var validate_nickName = !validator.isEmpty(params.userNick);
                var validate_password = !validator.isEmpty(params.userPassword);
                var validator_dir = !validator.isEmpty(params.userDir);
                
            } catch (err) {
                
                return res.status(500).send({
                    status: 'Error',
                    message: 'Error de validacion',
                   
                }) 
            }

            if(validate_nombre && validate_apellido && validate_email && validate_nickName && validate_password && validator_dir ){
            
                User.findOneAndUpdate({_id: userId}, params, {returnOriginal: false}, (err, userUpdated) => {
                    if(err){
                        return res.status(500).send({
                            status: 'Error',
                            message: 'Error al actualizar !!!'
                        });
                    }

                    if(!userUpdated){
                        return res.status(404).send({
                            status: 'Error',
                            message: 'No existe el articulo !!!'
                        })
                    }

                    return res.status(200).send({
                        status: 'success',
                        message: 'User actualizado',
                        user: userUpdated
                    })

                })               
            
            }else{
                return res.status(500).send({
                    status: 'Error',
                    message: 'Validacion incorrecta, no puede quedar ningun campo vacio'
                })
            }
        })
    },

    delete: (req, res) => {

        var userId = req.params.id

        console.log(userId)

        User.findOneAndDelete({_id: userId}, (err, userRemoved) => {
            if(err){
                return res.status(500).send({
                    status: 'Error',
                    message: 'Se ha producido un error al borrar el usuario'                      
                })
            }

            if(!userRemoved){
                return res.status(404).send({
                    status: 'Error',
                    message: 'No se ha borrado el usuario, posiblemente no exista !!!'
                })
            }
            return res.status(200).send({
                status: 'Success',
                message: 'Usuario eliminado con exito',
                userRemoved
            })
        })
    }



}

module.exports = controller