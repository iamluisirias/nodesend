//Schema
const Usuario = require('../models/Usuario');

//Hashing
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.crearUsuario = async (req, res) => {

    //Muestra los mensajes de error del middleware de express-validator
    const errores = validationResult(req);
   
    //Si los errores no estan vacios, entonces la validacion no fue aprobada.
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    //Extrayendo los datos de la peticion o request.
    const { email, password } = req.body;

    //Buscar si un email ya ha sido registrado
    let usuario = await Usuario.findOne({ email });

    //Si ya existe una coincidencia
    if (usuario) {
        return res.status(400).json({ msg: 'Este usuario ya ha sido registrado' });
    }

    //Creando una instancia de un usuario.
    usuario = new Usuario(req.body);

    //Hasheando password del nuevo usuario.
    //salt es basicamente el numero de veces que se hasheara el dato.
    const salt = await bcrypt.genSalt(10);

    usuario.password = await bcrypt.hash(password, salt);

    try {
        //Se guarda en la base de datos.
        await usuario.save();
        res.json({ msg : 'Usuario creado correctamente' });
    } catch (error) {
        console.log(error);
    }
}