const db = require('../connection.js')
const {Schema,model} = require('mongoose')


const ProductSchema = new Schema ({
    nombre: String,
    precio: String,
    portada: String
})

const productomodel = model('productos', ProductSchema)

module.exports = {productomodel: productomodel}

