const express = require('express');

const router = express.Router();

const orderController =
    require('../controllers/orderController');


// GET /orders
router.get(
    '/',
    orderController.index
);


// GET /orders/create
router.get(
    '/create',
    orderController.createForm
);


// POST /orders/create
router.post(
    '/create',
    orderController.create
);


// GET /orders/edit/1
router.get(
    '/edit/:id',
    orderController.editForm
);


// POST /orders/edit/1
router.post(
    '/edit/:id',
    orderController.update
);


// POST /orders/delete/1
router.post(
    '/delete/:id',
    orderController.remove
);


module.exports = router;