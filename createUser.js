const bcrypt = require('bcrypt');
const pool = require('./config/database');

async function createUser() {

    try {

        const username = 'admin';
        const password = '123456';

        const hashedPassword =
            await bcrypt.hash(password, 10);

        await pool.query(
            `INSERT INTO Users
            (Username, Password)
            VALUES (?, ?)`,
            [
                username,
                hashedPassword
            ]
        );

        console.log('使用者建立成功');

    } catch (error) {

        console.error(error);

    } finally {

        await pool.end();

    }

}

createUser();