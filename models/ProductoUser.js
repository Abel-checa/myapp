const db = require('../connection.js')
const {Schema,model} = require('mongoose')


const PrUserSchema = new Schema ({
    id_user: String,
    nombre: String,
    precio: String,
    portada: String
})

const PrUsermodel = model('Producto_Usuario', PrUserSchema)

module.exports = {PrUsermodel: PrUsermodel}