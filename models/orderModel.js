const pool = require('../config/database');


// 查詢所有 Orders
async function getAllOrders() {

    const [rows] = await pool.query(
        `SELECT
            o.OrderID,
            o.CustomerID,
            o.OrderDate,
            COALESCE(
                SUM(od.UnitPrice * od.Quantity),
                0
            ) AS OrderTotal
         FROM Orders o
         LEFT JOIN Order_Details od
            ON o.OrderID = od.OrderID
         GROUP BY
            o.OrderID,
            o.CustomerID,
            o.OrderDate
         ORDER BY o.OrderID`
    );

    return rows;
}


// 查詢單一 Order
async function getOrderById(orderId) {

    const [rows] = await pool.query(
        `SELECT
            o.OrderID,
            o.CustomerID,
            o.OrderDate,
            COALESCE(
                SUM(od.UnitPrice * od.Quantity),
                0
            ) AS OrderTotal
         FROM Orders o
         LEFT JOIN Order_Details od
            ON o.OrderID = od.OrderID
         WHERE o.OrderID = ?
         GROUP BY
            o.OrderID,
            o.CustomerID,
            o.OrderDate`,
        [orderId]
    );

    return rows[0];
}


// 新增 Order
async function createOrder(
    CustomerID,
    OrderDate
) {

    const [result] = await pool.query(
        `INSERT INTO Orders
        (CustomerID, OrderDate)
        VALUES (?, ?)`,
        [
            CustomerID,
            OrderDate
        ]
    );

    return result;
}


// 修改 Order
async function updateOrder(
    orderId,
    CustomerID,
    OrderDate
) {

    const [result] = await pool.query(
        `UPDATE Orders
         SET CustomerID = ?,
             OrderDate = ?
         WHERE OrderID = ?`,
        [
            CustomerID,
            OrderDate,
            orderId
        ]
    );

    return result;
}


// 刪除 Order
async function deleteOrder(orderId) {

    const [result] = await pool.query(
        `DELETE FROM Orders
         WHERE OrderID = ?`,
        [orderId]
    );

    return result;
}


module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};