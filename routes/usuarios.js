const express = require('express');

//Usando el routing de express.
const router = express.Router();

//Controlador de usuario.
const usuarioController = require('../controllers/usuarioController');

//Middleware para validacion de campos
const { check } = require('express-validator');

router.post('/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),                                //Revisa que no esté vacío.
        check('email', 'Agrega un email válido').isEmail(),                                         //Revisa que sea un email válido.
        check('password', 'El passsword debe ser mínimo de 8 caracteres').isLength({ min: 8 })      //Revisa que su longitud sea de un mínimo de 8 caracteres.

    ],
    usuarioController.crearUsuario
)

module.exports = router;
