const db = require('../connection.js')
const {Schema,model} = require('mongoose')


const UserSchema = new Schema ({
    nombre: String,
    password: String,
    email: String,
    imagen: String
})

const Usermodel = model('usuarios', UserSchema)

module.exports = {Usermodel: Usermodel}

