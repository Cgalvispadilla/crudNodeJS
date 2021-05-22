const express = require('express')
const router = express.Router();
const pool = require('../database')
const fs = require('fs');
const {isLoggedIn}=require('../lib/proteccionrutas')



//ruta principal de los productos
router.get('/index', isLoggedIn ,async (req, res) => {
    const productos = await pool.query('SELECT * FROM productos')
    res.render('productos/index', { productos })
})
//rutas para mostrar formulario
router.get('/create', isLoggedIn , (req, res) => {
    res.render('productos/create')
})
//ruta para crear los productos
router.post('/create', isLoggedIn,async (req, res) => {
    const { nombre, Descripcion, precio, talla, categoria, cantidad, color, imagen } = req.body

    const producto = {
        nombre,
        Descripcion,
        precio,
        talla,
        categoria,
        cantidad,
        color,
        imagen
    }
    //le paso el nombre a la variable imagen que me genera Multer
    producto.imagen = req.file.filename

    console.log(producto)
    await pool.query('INSERT INTO productos SET ?', [producto])
    res.render('productos/create')
})

router.get('/delete/:id', isLoggedIn,async (req, res) => {
    const { id } = req.params
    const img = await pool.query('SELECT imagen FROM productos WHERE id = ?', [id])
    await pool.query('DELETE FROM productos WHERE ID = ?', [id])
    res.redirect('/productos/index')
    const eliminar = `src/public/images/productos/${img[0].imagen}`
    fs.unlinkSync(eliminar);
})

router.get('/edit/:id', isLoggedIn,async (req, res) => {
    const { id } = req.params
    const producto = await pool.query('SELECT * FROM productos WHERE id = ?', [id])
    console.log(producto)
    res.render('productos/edit', { producto: producto[0] })

})
router.post('/edit/:id', isLoggedIn,async (req, res) => {
    const { id } = req.params
    const { nombre, Descripcion, precio, talla, categoria, cantidad, color, imagen } = req.body
    const producto = {
        nombre,
        Descripcion,
        precio,
        talla,
        categoria,
        cantidad,
        color,
        imagen
    }
    //se verifica si no se mando alguna imagen por el formulario
    if (req.file == null) {
        //siendo que viene vacio busco la imagen que tiene el usario que se quiere editar y se le asigna
        const img = await pool.query('SELECT imagen FROM productos WHERE id = ?', [id])
        producto.imagen = img[0].imagen
    } else {

        //en caso de que si manden la imagen se busca la vieja que tiene, se elimina y se actualiza por la nueva
        const img = await pool.query('SELECT imagen FROM productos WHERE id = ?', [id])
        const eliminar = `src/public/images/productos/${img[0].imagen}`
        fs.unlinkSync(eliminar);
        producto.imagen = req.file.filename
    }
    console.log(producto)
    await pool.query('UPDATE productos SET ? WHERE id = ?', [producto, id])
    res.redirect('/productos/index')


})

module.exports = router;