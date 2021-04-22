const express = require('express');
const conectarDB = require('./config/db');

//Creando el servidor
const app = express();

//Conectando a la base de datos.
conectarDB();

console.log('Inicializando NodeSend');

//Definiendo el puerto del servidor
const port = process.env.PORT || 4000;      

//Habilitando el poder leer el contenido de una request.
app.use( express.json() )

//Definiendo las rutas de la app.
app.use('/api/usuarios', require('./routes/usuarios'));  //Usamos la ruta /api/usuarios para cualquer accion que este dentro del archivo usuarios en la carpeta de rutas.

//Iniciando el servidor.
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
})