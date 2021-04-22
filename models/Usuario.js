const mongoose = require('mongoose');

//Para poder definir una clase o esquema para una coleccion, en este caso los usuarios.
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('Usuario', usuarioSchema);