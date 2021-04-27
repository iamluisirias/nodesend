const express = require('express');
const router = express.Router();
const archivoController = require('../controllers/archivoController');
const auth = require('../middleware/auth');

router.post('/',
    archivoController.subirArchivo
);

router.delete('/:id',
    auth,
    archivoController.eliminarArchivo
)

module.exports = router;