const express = require('express');
const router = express.Router();
const archivoController = require('../controllers/archivoController');

router.post('/',
    archivoController.subirArchivo
);

router.get('/:archivo',
    archivoController.descargarArchivo,
    archivoController.eliminarArchivo
)

module.exports = router;