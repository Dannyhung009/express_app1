const express = require('express');
const pool = require('./db');

const app = express();
const PORT = 3000;

// 設定 EJS
app.set('view engine', 'ejs');

// 解析 POST 表單
app.use(express.urlencoded({ extended: true }));

// 靜態檔案
app.use(express.static('public'));


// ========================
// Products - READ
// ========================
app.get('/products', async (req, res) => {

    try {

        const [products] = await pool.query(
            'SELECT * FROM Products ORDER BY ProductID'
        );

        res.render('products/index', {
            products: products
        });

    } catch (error) {

        console.error(error);

        res.status(500).send('資料庫錯誤');

    }

});


// ========================
// Products - CREATE 表單
// ========================
app.get('/products/create', (req, res) => {

    res.render('products/create');

});


// ========================
// Products - CREATE
// ========================
app.post('/products/create', async (req, res) => {

    try {

        const {
            ProductName,
            UnitPrice,
            UnitsInStock
        } = req.body;

        await pool.query(
            `INSERT INTO Products
            (ProductName, UnitPrice, UnitsInStock)
            VALUES (?, ?, ?)`,
            [
                ProductName,
                UnitPrice,
                UnitsInStock
            ]
        );

        res.redirect('/products');

    } catch (error) {

        console.error(error);

        res.status(500).send('新增商品失敗');

    }

});


// ========================
// Products - UPDATE 表單
// ========================
app.get('/products/edit/:id', async (req, res) => {

    try {

        const { id } = req.params;

        const [products] = await pool.query(
            'SELECT * FROM Products WHERE ProductID = ?',
            [id]
        );

        if (products.length === 0) {
            return res.status(404).send('找不到商品');
        }

        res.render('products/edit', {
            product: products[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).send('資料庫錯誤');

    }

});


// ========================
// Products - UPDATE
// ========================
app.post('/products/edit/:id', async (req, res) => {

    try {

        const { id } = req.params;

        const {
            ProductName,
            UnitPrice,
            UnitsInStock
        } = req.body;

        await pool.query(
            `UPDATE Products
             SET ProductName = ?,
                 UnitPrice = ?,
                 UnitsInStock = ?
             WHERE ProductID = ?`,
            [
                ProductName,
                UnitPrice,
                UnitsInStock,
                id
            ]
        );

        res.redirect('/products');

    } catch (error) {

        console.error(error);

        res.status(500).send('修改商品失敗');

    }

});


// ========================
// Products - DELETE
// ========================
app.post('/products/delete/:id', async (req, res) => {

    try {

        const { id } = req.params;

        await pool.query(
            'DELETE FROM Products WHERE ProductID = ?',
            [id]
        );

        res.redirect('/products');

    } catch (error) {

        console.error(error);

        res.status(500).send('刪除商品失敗');

    }

});

// ========================
// Orders - READ
// ========================
app.get('/orders', async (req, res) => {

    try {

        const [orders] = await pool.query(
            `SELECT *
             FROM Orders
             ORDER BY OrderID`
        );

        res.render('orders/index', {
            orders: orders
        });

    } catch (error) {

        console.error(error);

        res.status(500).send('查詢訂單失敗');

    }

});


// ========================
// Orders - CREATE 表單
// ========================
app.get('/orders/create', (req, res) => {

    res.render('orders/create');

});


// ========================
// Orders - CREATE
// ========================
app.post('/orders/create', async (req, res) => {

    try {

        const {
            CustomerID,
            OrderDate
        } = req.body;

        await pool.query(
            `INSERT INTO Orders
            (CustomerID, OrderDate)
            VALUES (?, ?)`,
            [
                CustomerID,
                OrderDate
            ]
        );

        res.redirect('/orders');

    } catch (error) {

        console.error(error);

        res.status(500).send('新增訂單失敗');

    }

});


// ========================
// Orders - UPDATE 表單
// ========================
app.get('/orders/edit/:id', async (req, res) => {

    try {

        const { id } = req.params;

        const [orders] = await pool.query(
            `SELECT *
             FROM Orders
             WHERE OrderID = ?`,
            [id]
        );

        if (orders.length === 0) {

            return res.status(404).send('找不到訂單');

        }

        res.render('orders/edit', {
            order: orders[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).send('查詢訂單失敗');

    }

});


// ========================
// Orders - UPDATE
// ========================
app.post('/orders/edit/:id', async (req, res) => {

    try {

        const { id } = req.params;

        const {
            CustomerID,
            OrderDate
        } = req.body;

        await pool.query(
            `UPDATE Orders
             SET CustomerID = ?,
                 OrderDate = ?
             WHERE OrderID = ?`,
            [
                CustomerID,
                OrderDate,
                id
            ]
        );

        res.redirect('/orders');

    } catch (error) {

        console.error(error);

        res.status(500).send('修改訂單失敗');

    }

});


// ========================
// Orders - DELETE
// ========================
app.post('/orders/delete/:id', async (req, res) => {

    try {

        const { id } = req.params;

        await pool.query(
            `DELETE FROM Orders
             WHERE OrderID = ?`,
            [id]
        );

        res.redirect('/orders');

    } catch (error) {

        console.error(error);

        res.status(500).send('刪除訂單失敗');

    }

});



// ========================
// Order_Details - READ
// ========================
app.get('/orders/:orderId/details', async (req, res) => {

    try {

        const { orderId } = req.params;

        // 查詢訂單
        const [orders] = await pool.query(
            `SELECT *
             FROM Orders
             WHERE OrderID = ?`,
            [orderId]
        );

        if (orders.length === 0) {
            return res.status(404).send('找不到訂單');
        }

        // JOIN Products
        const [details] = await pool.query(
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

        res.render('order_details/index', {
            order: orders[0],
            details: details
        });

    } catch (error) {

        console.error(error);

        res.status(500).send('查詢訂單明細失敗');

    }

});


// ========================
// Order_Details - CREATE 表單
// ========================
app.get('/orders/:orderId/details/create', async (req, res) => {

    try {

        const { orderId } = req.params;

        // 查詢訂單
        const [orders] = await pool.query(
            `SELECT *
             FROM Orders
             WHERE OrderID = ?`,
            [orderId]
        );

        if (orders.length === 0) {
            return res.status(404).send('找不到訂單');
        }

        // 查詢所有商品
        const [products] = await pool.query(
            `SELECT *
             FROM Products
             ORDER BY ProductName`
        );

        res.render('order_details/create', {
            order: orders[0],
            products: products
        });

    } catch (error) {

        console.error(error);

        res.status(500).send('載入資料失敗');

    }

});


// ========================
// Order_Details - CREATE
// ========================
app.post('/orders/:orderId/details/create', async (req, res) => {

    try {

        const { orderId } = req.params;

        const {
            ProductID,
            Quantity
        } = req.body;

        // 先從 Products 取得目前價格
        const [products] = await pool.query(
            `SELECT UnitPrice
             FROM Products
             WHERE ProductID = ?`,
            [ProductID]
        );

        if (products.length === 0) {
            return res.status(404).send('找不到商品');
        }

        const UnitPrice = products[0].UnitPrice;

        // 新增訂單明細
        await pool.query(
            `INSERT INTO Order_Details
            (OrderID, ProductID, UnitPrice, Quantity)
            VALUES (?, ?, ?, ?)`,
            [
                orderId,
                ProductID,
                UnitPrice,
                Quantity
            ]
        );

        res.redirect(`/orders/${orderId}/details`);

    } catch (error) {

        console.error(error);

        // 複合主鍵重複
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).send(
                '這個商品已經存在於此訂單中'
            );
        }

        res.status(500).send('新增訂單明細失敗');

    }

});


// ========================
// Order_Details - UPDATE 表單
// ========================
app.get(
    '/orders/:orderId/details/edit/:productId',
    async (req, res) => {

        try {

            const {
                orderId,
                productId
            } = req.params;

            const [details] = await pool.query(
                `SELECT
                    od.OrderID,
                    od.ProductID,
                    p.ProductName,
                    od.UnitPrice,
                    od.Quantity
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

            if (details.length === 0) {
                return res.status(404).send(
                    '找不到訂單明細'
                );
            }

            res.render('order_details/edit', {
                detail: details[0]
            });

        } catch (error) {

            console.error(error);

            res.status(500).send(
                '查詢訂單明細失敗'
            );

        }

    }
);


// ========================
// Order_Details - UPDATE
// ========================
app.post(
    '/orders/:orderId/details/edit/:productId',
    async (req, res) => {

        try {

            const {
                orderId,
                productId
            } = req.params;

            const {
                Quantity
            } = req.body;

            await pool.query(
                `UPDATE Order_Details
                 SET Quantity = ?
                 WHERE OrderID = ?
                   AND ProductID = ?`,
                [
                    Quantity,
                    orderId,
                    productId
                ]
            );

            res.redirect(
                `/orders/${orderId}/details`
            );

        } catch (error) {

            console.error(error);

            res.status(500).send(
                '修改訂單明細失敗'
            );

        }

    }
);


// ========================
// Order_Details - DELETE
// ========================
app.post(
    '/orders/:orderId/details/delete/:productId',
    async (req, res) => {

        try {

            const {
                orderId,
                productId
            } = req.params;

            await pool.query(
                `DELETE FROM Order_Details
                 WHERE OrderID = ?
                   AND ProductID = ?`,
                [
                    orderId,
                    productId
                ]
            );

            res.redirect(
                `/orders/${orderId}/details`
            );

        } catch (error) {

            console.error(error);

            res.status(500).send(
                '刪除訂單明細失敗'
            );

        }

    }
);



// ========================
// 首頁
// ========================
app.get('/', (req, res) => {

    res.redirect('/products');

});


// 啟動 Server
app.listen(PORT, () => {

    console.log(`網站啟動：http://localhost:${PORT}`);

});