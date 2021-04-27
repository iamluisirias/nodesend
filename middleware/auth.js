const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' })

module.exports = ( req, res, next ) => {
    const authHeader = req.get('Authorization');

    if (authHeader) {
       //Se obtiene el JWT
        const token = authHeader.split(' ')[1];      //Se genera un arreglo a partir del header de authorization agarrando la parte despues del espacio, osea el token en si, sin el 'Bearer'.
       
        try {
            //Se comprueba el JWT
            const usuario = jwt.verify( token, process.env.SECRETA );
            
            //Se asigna el usuario a la petición
            req.usuario = usuario;

        } catch (error) {
            console.log(error, 'JWT no válido');
        }
    } 

    return next()       //Una vez que termine este middleware, pasa al siguiente.
}