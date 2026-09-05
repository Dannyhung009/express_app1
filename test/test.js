// const pool = require('./db');

// async function testConnection() {
//     try {
//         const connection = await pool.getConnection();

//         console.log('MySQL 連線成功！');

//         connection.release();
//     } catch (error) {
//         console.error('MySQL 連線失敗！');
//         console.error(error.message);
//     }
// }

// testConnection();

const pool = require('./db');

async function testMySQL() {
    try {
        // 測試連線
        const connection = await pool.getConnection();

        console.log('MySQL 連線成功！');

        connection.release();

        // 測試 SQL
        const [rows] = await pool.query(
            'SELECT * FROM Products'
        );

        console.log('Products 資料：');
        console.table(rows);

    } catch (error) {
        console.error('MySQL 發生錯誤：');
        console.error(error.message);
    } finally {
        await pool.end();
    }
}

testMySQL();