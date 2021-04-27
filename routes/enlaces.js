const express = require('express');
const router = express.Router();
const enlaceController = require('../controllers/enlaceController');
const archivoController = require('../controllers/archivoController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

router.post('/',
    [
        check('nombre','Sube un archivo').not().isEmpty(),
        check('nombre_original','Sube un archivo').not().isEmpty()
    ],
    auth,
    enlaceController.crearEnlace
);

router.get('/:url',
    enlaceController.obtenerEnlace,
    archivoController.eliminarArchivo
);

module.exports = router;