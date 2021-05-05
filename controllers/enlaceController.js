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

    //Destructuring de la petición.
    const { nombre_original, nombre } = req.body;

    //Creando un objeto enlace con todos los atributos definidos en el schema.
    const enlace = new Enlace();            
    enlace.url = shortid.generate();        //Generando una url a partir de un id, amigable para una url.
    enlace.nombre = nombre;   
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

//Verifica si un enlace fue protegido con una contraseña
exports.comprobarPassword = async ( req, res, next ) => {
    //Extrayendo el url que envia como parametro de la peticion
    const { url } = req.params;

    //Verificando si el enlace existe.
    const enlace = await Enlace.findOne({ url: url });

    if (!enlace) {
        res.status(404).json({ msg: 'Ese enlace no existe.' })
        return next();
    }

    //Si existe un password en el enlace creado en la base de datos.
    if (enlace.password) {
        res.json({ password: true, enlace: enlace.url });
        return next();
    }

    //Lo manda al siguiente middleware ( obtenerEnlace );
    return next();
}

//Verifica si la contraseña para poder descargar el archivo es válida.
exports.verificarPassword = async ( req, res, next ) => {
    
    const { url } = req.params;
    const { password } = req.body;

    const enlace = await Enlace.findOne({ url });

    //Aquí se verifica el password
    if (bcrypt.compareSync( password, enlace.password )) {
        //Permitir la descarga del archivo.

        //Pasa al siguiente middleware que será el que le permita descargar al usuario.
        return next()
    } else {
        return res.status(401).json({ msg: 'Password Incorrecto' })
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
        return next();
    }

    //Si el enlace existe
    res.json({ archivo: enlace.nombre, password: false });

    //Vamos al siguiente middleware
    return next();
}

//Obtiene un listado de todos los enlaces.
exports.retornarEnlaces = async ( req, res, next ) => {
    try {
        const enlaces = await Enlace.find({}).select('url -_id');
        res.json({enlaces})
    } catch (error) {
        console.log(error);
    }
}

