const mysql = require('mysql')
const { database } = require('./keys') 
const {promisify} = require('util')

const pool=mysql.createPool(database)

pool.getConnection((err, connection) =>{
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('se cerro la conexion con la base de datos')
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('La base de datos solo tiene una conexión')
        }
        if(err.code === 'ECONNREFUSED'){
            console.error('la conexion de la base de dato fue rechazada')
        }
    }
    if(connection) connection.release();
    console.log('Conectado a la DB')
    return;
})

pool.query=promisify(pool.query)

module.exports = pool;