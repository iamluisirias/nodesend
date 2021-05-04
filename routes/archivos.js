const express = require('express');
const router = express.Router();
const archivoController = require('../controllers/archivoController');
const auth = require('../middleware/auth');

router.post('/',
    archivoController.subirArchivo
);

router.get('/:archivo',
    archivoController.descargarArchivo,
    archivoController.eliminarArchivo
)

module.exports = router;