/*------------------------------------Configuracion para conectar la base de datos.-------------------------------------------------*/

//Exportando el modulo de MongoDB para conectar la base de datos a la aplicacion.
const mongoose = require('mongoose');

//Configurando las variables de entorno.
require('dotenv').config({
    path: 'variables.env'
});

//Funcion para conectar a la base de datos.
const conectarDB = async () => {
    try {
        
        await mongoose.connect( process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true,
            useCreateIndex: true

        } );

        console.log('Conectado a base de Datos');

    } catch (error) {
        console.log('Hubo al conectarse a la DB', error);
        process.exit(1);        //Deteniendo una aplicacion en node.js, se detiene el servidor.
    }
};

module.exports = conectarDB;
