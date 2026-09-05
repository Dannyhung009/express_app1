const pool = require('../config/database');


// 查詢所有商品
async function getAllProducts() {

    const [rows] = await pool.query(
        `SELECT *
         FROM Products
         ORDER BY ProductID`
    );

    return rows;
}


// 查詢單一商品
async function getProductById(productId) {

    const [rows] = await pool.query(
        `SELECT *
         FROM Products
         WHERE ProductID = ?`,
        [productId]
    );

    return rows[0];
}


// 新增商品
async function createProduct(
    ProductName,
    UnitPrice,
    UnitsInStock
) {

    const [result] = await pool.query(
        `INSERT INTO Products
        (ProductName, UnitPrice, UnitsInStock)
        VALUES (?, ?, ?)`,
        [
            ProductName,
            UnitPrice,
            UnitsInStock
        ]
    );

    return result;
}


// 修改商品
async function updateProduct(
    productId,
    ProductName,
    UnitPrice,
    UnitsInStock
) {

    const [result] = await pool.query(
        `UPDATE Products
         SET ProductName = ?,
             UnitPrice = ?,
             UnitsInStock = ?
         WHERE ProductID = ?`,
        [
            ProductName,
            UnitPrice,
            UnitsInStock,
            productId
        ]
    );

    return result;
}


// 刪除商品
async function deleteProduct(productId) {

    const [result] = await pool.query(
        `DELETE FROM Products
         WHERE ProductID = ?`,
        [productId]
    );

    return result;
}


module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};