const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

//Creando el servidor
const app = express();

//Conectando a la base de datos.
conectarDB();

//Configurando cors
const corsOptions = {
    origin: process.env.FRONTEND_URL     //Solo aceptara peticiones de la url de frontEnd definida en las variables de entorno.
} 

//Habilitando CORS
app.use( cors(corsOptions) );          //Habilita poderhacer peticiones desde otro dominio distinto al del server.

console.log('Inicializando NodeSend');

//Definiendo el puerto del servidor
const port = process.env.PORT || 4000;      

//Habilitando el poder leer el contenido de una request.
app.use( express.json() );

//Definiendo las rutas de la app.
app.use('/api/usuarios', require('./routes/usuarios'));  //Usamos la ruta /api/usuarios para cualquer accion que este dentro del archivo usuarios en la carpeta de rutas.
app.use('/api/auth', require('./routes/auth'));     //Para que un usuario inicie sesion el endpoint es la autenticacion.
app.use('/api/enlaces', require('./routes/enlaces'));   //Endpoint para guardar los enlaces.
app.use('/api/archivos', require('./routes/archivos')); //Endpoint para manejar los archivos que manden los usuarios.   

//Iniciando el servidor.
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
})