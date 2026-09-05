const pool = require('../config/database');


// 查詢某張訂單的所有明細
// JOIN Products
async function getDetailsByOrderId(orderId) {

    const [rows] = await pool.query(
        `SELECT
            od.OrderID,
            od.ProductID,
            p.ProductName,
            od.UnitPrice,
            od.Quantity,
            od.UnitPrice * od.Quantity AS SubTotal
         FROM Order_Details od
         INNER JOIN Products p
            ON od.ProductID = p.ProductID
         WHERE od.OrderID = ?
         ORDER BY od.ProductID`,
        [orderId]
    );

    return rows;
}


// 查詢單一明細
async function getDetail(
    orderId,
    productId
) {

    const [rows] = await pool.query(
        `SELECT
            od.OrderID,
            od.ProductID,
            p.ProductName,
            od.UnitPrice,
            od.Quantity,
            od.UnitPrice * od.Quantity AS SubTotal
         FROM Order_Details od
         INNER JOIN Products p
            ON od.ProductID = p.ProductID
         WHERE od.OrderID = ?
           AND od.ProductID = ?`,
        [
            orderId,
            productId
        ]
    );

    return rows[0];
}


// 新增明細
async function createDetail(
    orderId,
    productId,
    unitPrice,
    quantity
) {

    const [result] = await pool.query(
        `INSERT INTO Order_Details
        (OrderID, ProductID, UnitPrice, Quantity)
        VALUES (?, ?, ?, ?)`,
        [
            orderId,
            productId,
            unitPrice,
            quantity
        ]
    );

    return result;
}


// 修改數量
async function updateDetail(
    orderId,
    productId,
    quantity
) {

    const [result] = await pool.query(
        `UPDATE Order_Details
         SET Quantity = ?
         WHERE OrderID = ?
           AND ProductID = ?`,
        [
            quantity,
            orderId,
            productId
        ]
    );

    return result;
}


// 刪除明細
async function deleteDetail(
    orderId,
    productId
) {

    const [result] = await pool.query(
        `DELETE FROM Order_Details
         WHERE OrderID = ?
           AND ProductID = ?`,
        [
            orderId,
            productId
        ]
    );

    return result;
}


// 計算訂單總額
async function getOrderTotal(orderId) {

    const [rows] = await pool.query(
        `SELECT
            COALESCE(
                SUM(UnitPrice * Quantity),
                0
            ) AS OrderTotal
         FROM Order_Details
         WHERE OrderID = ?`,
        [orderId]
    );

    return rows[0].OrderTotal;
}


module.exports = {
    getDetailsByOrderId,
    getDetail,
    createDetail,
    updateDetail,
    deleteDetail,
    getOrderTotal
};