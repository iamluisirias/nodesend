const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

router.post('/',
    [
        check( 'email', 'Ingrese un email válido').isEmail(),
        check( 'password', 'El password no debe de estar vacío').not().isEmpty()
    ],
    authController.iniciarSesion
);

router.get('/',
    auth,       //Aplicando el uso del custom middleware.
    authController.obtenerUsuarioAutenticado
)

module.exports = router;