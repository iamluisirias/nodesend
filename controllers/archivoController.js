const shortid = require('shortid');
//Biblioteca para subir archivos.
const multer = require('multer');
const fs = require('fs');



exports.subirArchivo = async ( req, res, next ) => {

    //Objeto de configuracion de multer
    const configMulter = {
        limits: { fileSize: req.usuario ? (10(1024 * 1024)) : (1024 * 1024) },                 //Limites -> Tamano de archivo -> 1MB si no está registrado y si esta registrado 10MB
        storage: fileStorage = multer.diskStorage({     //Como sera que se almacene el archivo
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
    console.log('Intentando eliminar archivo.', req.archivo);

    try {
        fs.unlinkSync(__dirname+`/../uploads/${req.archivo}`);
        console.log('Archivo eliminado.')
    } catch (error) {
        console.log(error);
    }
    

}