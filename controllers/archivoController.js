const shortid = require('shortid');
//Biblioteca para subir archivos.
const multer = require('multer');
const fs = require('fs');

const Enlace = require('../models/Enlace');



exports.subirArchivo = async ( req, res, next ) => {

    //Objeto de configuracion de multer
    const configMulter = {
        limits: { fileSize: req.usuario ? (10(1024 * 1024)) : (1024 * 1024) },                 //Limites -> Tamano de archivo -> 1MB si no está registrado y si esta registrado 10MB
        storage: fileStorage = multer.diskStorage({     //Como será que se almacene el archivo
            destination: ( req, file, cb ) => {         //Donde se guarda
                cb( null, __dirname+'/../uploads' )
            },
            filename: ( req, file, cb ) => {           //Con que nombre se guarda.
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb( null, `${shortid.generate()}${extension}` )
            }
        })
    }

const upload = multer(configMulter).single('archivo');

    upload( req, res, async(error) => {
        if (!error) {
            res.json({ archivo: req.file.filename })
        } else {
            console.log(error);
            return next();
        }
    })
}

exports.eliminarArchivo = async ( req, res, next ) => {

    try {
        fs.unlinkSync(__dirname+`/../uploads/${req.archivo}`);
        console.log('Archivo eliminado.')
    } catch (error) {
        console.log(error);
    }

}

exports.descargarArchivo = async ( req, res, next ) => {
    //Destructuring de la petición
    const { archivo } = req.params;

    //Obtiene el enlace
    const enlace = await Enlace.findOne({ nombre: archivo });
    
    //Direccion exacta de donde está el archivo
    const DireccionArchivo = __dirname + `/../uploads/${archivo}`;

    //A descargar el archivo mi rey.
    //Direccion del archivo, nombre original del archivo.
    res.download(DireccionArchivo, enlace.nombre_original);

    //--------------------Ahora se elimina el archivo y la entrada de la base de datos.------------------------
    //Si las descargas son iguales a 1, se borra la entrada y el archivo.

    const { descargas, nombre } = enlace;

    if (descargas === 1) {
        console.log('Si solo 1');

        //Se asigna el archivo a eliminar.
        req.archivo = nombre;
  
        //Eliminar la entrada en la base de datos.
        await Enlace.findOneAndRemove( enlace._id );
  
        return next();      //Esto lo manda al siguiente middleware (eliminarArchivo).
  
    } else {
        //Si las descargas son > 1, se resta 1.
        enlace.descargas--;
        await enlace.save();
        console.log('Aun hay descargas ', descargas);
    }
}