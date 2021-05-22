const express = require('express')
const router= express.Router();
const pool = require('../database')
const passport =require('passport')
const {isLoggedIn, isNotLoggedIn }=require('../lib/proteccionrutas')

router.get('/registrarse',isNotLoggedIn,(req,res) =>{
    res.render('auth/registrarse');
})
router.post('/registrarse',passport.authenticate('Local.registrarse',{
    successRedirect: '/login',
    failureRedirect: '/registrarse'
}))

router.get('/login', isNotLoggedIn ,(req, res)=>{
    res.render('auth/login')
})
router.post('/login', isNotLoggedIn,(req, res, next) => {
   
    passport.authenticate('Local.login', {
      successRedirect: '/perfil',
      failureRedirect: '/login',
    })(req, res, next);
});

router.get('/perfil',isLoggedIn, (req, res)=>{
    res.render('perfil')
})

router.get('/salir', (req, res)=>{
    req.logOut()
    res.redirect('/login')
})



module.exports= router;