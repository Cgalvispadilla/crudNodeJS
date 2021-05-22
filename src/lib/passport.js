const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const pool = require('../database')

const helper = require('./helpers')



passport.use('Local.registrarse', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done)=>{
    const {name, phone} = req.body
    const newUser ={
        name,
        phone,
        email,
        password
    }
    newUser.password = await helper.encryptPassword(password)
    const result = await pool.query('INSERT INTO users SET ?', [newUser])
    newUser.id= result.insertId
    return done(null, newUser)
}))
passport.use('Local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true

},  async (req, email, password, done)=>{
    
    const rows = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    console.log(rows[0])
    if(rows.length > 0){
        
        const user = rows[0]
        const validContra= await helper.login(password, user.password)
        if(validContra){
            done(null, user)
        }else{
            done(null, false)
        }
    }

}
))

passport.serializeUser((user, done)=>{
    done(null, user.id)
})

passport.deserializeUser(async (id, done)=>{
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id])
    done(null, rows[0])
})
// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });
  
// passport.deserializeUser(async (id, done) => {
//     const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
//     done(null, rows[0]);  
// });
