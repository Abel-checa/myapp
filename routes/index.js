const express = require('express');
const router = express.Router();
const db = require('../connection.js')
const {productomodel} = require('../models/Productos.js')
const {Usermodel} = require('../models/Usuarios.js')
const {PrUsermodel} = require('../models/ProductoUser.js')
const {body, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')

const bcrypt = require('bcryptjs');
const ProductoUser = require('../models/ProductoUser.js');

require('dotenv').config()
/* GET home page. */
router.get('/', (req, res, )=>{
  console.log(req.session);
  console.log(req.session);
  res.render('inicio');
});

router.get('/login', (req, res, )=>{
  console.log(req.session);
  if(req.session.logged){
    req.session.contador+=1
    res.redirect('/user/'+req.session.token)
  }else{
    res.render('login');
  }
  
});

router.post('/login',[
body('nombre','Introduzca un nombre Valido porfavor')
.exists()
.isLength({min:3}),
body('password','Introduzca una contraseña Valida porfavor')
.exists()
.isLength({min:3})
]
,async (req, res, )=>{
  const errors = validationResult(req)
  console.log('Errores');
  console.log(errors);

  const params = req.body
  if(!errors.isEmpty()){
    res.render('login',{errores: errors.errors, cuerpo: params});
  }else{
    const UserFound = await Usermodel.findOne({nombre: req.body.nombre})
    if(UserFound){
      const verificacion = await bcrypt.compare(req.body.password,UserFound.password)
      console.log(verificacion);  
      if(!verificacion){
        res.render('register')
      }else{
        const token = jwt.sign({nombre: req.body.nombre},process.env.SECRET)
        req.session.logged = true
        req.session.user = req.body.nombre
        req.session.token = token
        req.session.contador =0
        console.log(req.session);
        res.redirect('/user/'+token)
      }
    }else{
      res.render('register')
    }
   
  }
  
});


router.get('/register', (req, res, )=>{
  res.render('register');
});

router.post('/register',[
  body('nombre','Introduzca un nombre Valido porfavor')
  .exists()
  .isLength({min:3}),
  body('password','Introduzca una contraseña Valida porfavor')
  .exists()
  .isLength({min:1}),
  body('email','Introduzca un email Valido porfavor')
  .exists()
  .isEmail(),
  body('imagen','Introduzca una imagen Valida porfavor')
  .exists()
  .isLength({min:3})
  ]
  ,async (req, res, )=>{
    const errors = validationResult(req)
    const params = req.body
    if(!errors.isEmpty()){
      res.render('register',{errores: errors.errors, cuerpo: params});
    }else{
      const secure_pass = await bcrypt.hash(req.body.password,8)
      const User = new Usermodel({
        nombre: req.body.nombre,
        password: secure_pass,
        email: req.body.email,
        imagen: req.body.imagen
      })

      await User.save()
      res.redirect('/login')
    }
    
  });


router.get('/user/:token', async (req, res, )=>{
  if(jwt.verify(req.params.token, process.env.SECRET)){
    const user = jwt.verify(req.params.token, process.env.SECRET)
    console.log(user);
    const products = await PrUsermodel.find({id_user: user.nombre})
    console.log(products);
    res.render('user_inicio',{nombre: user.nombre, contador: req.session.contador, prod: products, largo: products.length})
    
  }else{
    res.json({
      msg: "No se puede acceder a este sitio"
    })
  }
});

router.get('/destroy', (req,res)=>{
  req.session.destroy()
  res.redirect('/')
})


router.get('/add', (req,res)=>{
  res.render('add')
})

router.post('/add',[
  body('nombre','Introduzca un nombre Valido porfavor')
  .exists()
  .isLength({min:3}),
  body('precio','Introduzca una precio')
  .exists()
  .isLength({min:1}),
  body('imagen','Introduzca una imagen Valida porfavor')
  .exists()
  .isLength({min:3})
  ],
async (req,res)=>{
  const errors = validationResult(req)
  const params = req.body
  if(!errors.isEmpty()){
    res.render('add',{errores: errors.errors, cuerpo: params});
  }else{
    
    const producto_user = new PrUsermodel({
      id_user: req.session.user,
      nombre: req.body.nombre,
      precio: req.body.precio,
      portada: req.body.imagen
    })

    await producto_user.save()
    res.redirect('/')
  }
  
})

module.exports = router;
