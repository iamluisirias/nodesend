const Enlace = require('../models/Enlace');
const { validationResult } = require('express-validator');
const shortid = require('shortid');
const bcrypt = require('bcrypt');

exports.crearEnlace = async ( req, res, next ) => {
    //Comprobar si hay errores.
    const errores = validationResult(req);

    if ( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() })
    }

    //Destructurind de la petición.
    const { nombre_original } = req.body;

    //Creando un objeto enlace con todos los atributos definidos en el schema.
    const enlace = new Enlace();            
    enlace.url = shortid.generate();        //Generando una url a partir de un id, amigable para una url.
    enlace.nombre = shortid.generate();     //Para guardar el archivo en la base de datos con otro nombre que no pueda reescribirse por otro con el mismo nombre.
    enlace.nombre_original = nombre_original;

    //Si el usuario está autenticado, tendrá más opciones.
    if (req.usuario) {  //Si hay un usuario autenticado haciendo la petición
        const { password, descargas } = req.body;

        //Ese user puede definir el número de descargas que se permitiran de su archivo.
        if ( descargas ) {
            enlace.descargas = descargas;
        }

        //El usuario puede definir una contraseña para proteger su archivo
        if ( password ) {
            const salt = await bcrypt.genSalt(10);
            enlace.password = await bcrypt.hash( password, salt );
        }

        //Ahora se vincula ese usuario al enlace que creo. 
        enlace.autor = req.usuario.id;
    }

    try {
        //Almacenando el objeto en la coleccion de la base de datos.
        await enlace.save();
        res.json({ msg: `${enlace.url}` });
        return next();
        
    } catch (error) {
        console.log(error);
        res.json({ msg: `Hubo un error al crear el enlace.` });
    }
}

//Obtener enlace para descarga de archivo.
exports.obtenerEnlace = async ( req, res, next ) => {

    //Extrayendo el url que envia como parametro de la peticion
    const { url } = req.params;

    //Verificando si el enlace existe.
    const enlace = await Enlace.findOne({ url: url });

    if (!enlace) {
        res.status(404).json({ msg: 'Ese enlace no existe.' })
    }

    //Si el enlace existe
    res.json({ archivo: enlace.nombre });

    //Si las descargas son iguales a 1, se borra la entrada y el archivo.

    const { descargas, nombre } = enlace;

    if (descargas === 1) {
        console.log('Si solo 1');

        //Eliminar el archivo.
        req.archivo = nombre;

        //Eliminar la entrada en la base de datos.
        await Enlace.findOneAndRemove( req.params.url );

        return next();      //Esto lo manda al siguiente middleware (eliminarEnlace).

    } else {
        enlace.descargas--;
        await enlace.save();
        console.log('Aun hay descargas ', descargas);
    }

    //Si las descargas son > 1, se resta 1.
}