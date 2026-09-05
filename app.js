const express = require('express');

const app = express();

const productRoutes =
    require('./routes/productRoutes');

const orderRoutes =
    require('./routes/orderRoutes');

const orderDetailRoutes =
    require('./routes/orderDetailRoutes');


const PORT = 3000;


// EJS
app.set('view engine', 'ejs');


// POST 表單
app.use(
    express.urlencoded({
        extended: true
    })
);


// CSS / JavaScript / Images
app.use(
    express.static('public')
);


// Products
app.use(
    '/products',
    productRoutes
);


// Orders
app.use(
    '/orders',
    orderRoutes
);


// Order Details
app.use(
    '/orders',
    orderDetailRoutes
);


// 首頁
app.get('/', (req, res) => {

    res.redirect('/orders');

});


// Server
app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});