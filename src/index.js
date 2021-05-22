/* inclusion de los modulos */
const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');
const session = require('express-session')
const mySQLstore = require('express-mysql-session')
const { database } = require('./keys')
const passport = require('passport')




/* inicializaciones */
const app = express()
require('./lib/passport')

/* configuraciones */
app.set('port', process.env.PORT || 7000)
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')

}))
app.set('view engine', '.hbs')

/*Middlewares*/
app.use(session({
    secret: 'cecymysqlsession',
    resave: false,
    saveUninitialized: false,
    store: new mySQLstore(database)
}))
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/images/productos'),
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname))
    }
})

const subir = multer({
    storage,
    dest: path.join(__dirname, 'public/images/productos'),
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/
        const mimetype = filetypes.test(file.mimetype)
        const extname = filetypes.test(file.originalname)
        if (mimetype & extname) {
            return cb(null, true)
        }
    }
}).single('imagen')
app.use(subir)
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(passport.session())


/* variables globales */
app.use((req, res, next) => {
    app.locals.user = req.user
    next();
})


/*Routes*/
app.use(require('./routes'))
app.use(require('./routes/auth'))
app.use('/productos', require('./routes/productos'))


/*public*/
app.use(express.static(path.join(__dirname, 'public')))

/*iniciar servidor*/
app.listen(app.get('port'), () => {
    console.log('El servidor esta corriendo en el puerto: ', app.get('port'))
})