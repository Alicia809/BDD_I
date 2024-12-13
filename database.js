const mysql = require('mysql2');

const conexion = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'tienda_ladies',
});

conexion.connect((err) =>{
    if(err){
        console.error('ERROR database', err);
        return;
    }
    console.log('CONEXION EXITOSA A MYSQL')
});

module.exports = conexion;