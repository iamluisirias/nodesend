const express = require('express');
const router = express.Router();
const enlaceController = require('../controllers/enlaceController');
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

router.get('/',
    enlaceController.retornarEnlaces
)

router.get('/:url',
    enlaceController.comprobarPassword,
    enlaceController.obtenerEnlace
);

router.post('/:url',
    enlaceController.verificarPassword,
    enlaceController.obtenerEnlace
);

module.exports = router;