const express = require('express');

//Usando el routing de express.
const router = express.Router();

const usuarioController = require('../controllers/usuarioController');

router.post('/',
    usuarioController.crearUsuario
)

module.exports = router;
