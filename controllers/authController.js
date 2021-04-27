//Usando Schema
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' })

exports.iniciarSesion = async ( req, res ) => {
    console.log('Intentando Iniciar Sesion');

    //Haciendo las comprobaciones de que los campos sean validos.
    const errores = validationResult(req);

    //Si existen errores en la validacion de datos, entonces retornar errores en un json.
    if( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() })
    }

    //Destructuring de la petición
    const { email, password } = req.body;

    //Comprobando si en verdad existe ese usuario.
    const usuario = await Usuario.findOne( { email } );

    //Si ese usuario no existe
    if (!usuario) {
        res.status(401).json({ msg: 'Ese usuario no existe, cree una cuenta' });     //401: Credenciales incorrectas.
        return next(); //Detiene de que se siga ejecutando el codigo.  
    }

    //El usuario si existe
    //Verificar si el password es correcto.
    if (bcrypt.compareSync( password, usuario.password )) {     //password de request con la password hasheada de la base de datos.
        
        //Se genera un JSONWebToken (JWT)
        const token = jwt.sign({
            id: usuario._id,                 //Generando un jwt a partir del id del usuario.
            nombre: usuario.nombre,          //Generando un jwt a partir de su nombre.
            email: usuario.email             //Generando un jwt a partir del email. 
                     
        }, process.env.SECRETA, {           //Se firma con la palabra secreta necesaria para "decodificarla"
            expiresIn: '24h'                 //Tiene una duración de 8 horas hasta que expire.
        });           
        
        res.json({ token });    

    } else {
        res.status(401).json({ msg: 'Password incorrecto' });
        return next();
    }
}

exports.obtenerUsuarioAutenticado = ( req, res, next ) => {
   res.json({ usuario: req.usuario });
};