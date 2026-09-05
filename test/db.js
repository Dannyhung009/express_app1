const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '6vy39i5T',
    database: 'danny',
    port: 3306
});

module.exports = pool;