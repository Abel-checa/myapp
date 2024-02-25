const mongoose = require('mongoose')
require('dotenv').config()

const uri = `${process.env.URI}`

const db = async ()=>{
    await mongoose.connect(uri)
}


try{
    db();
    mongoose.connection.once('open',()=>{
        console.log('Conexion Exitosa');
    })
}catch(e){
    mongoose.connection.once('error',()=>{
        console.log('Conexion Fallida');
    })
}