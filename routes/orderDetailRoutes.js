const express = require('express');

const router = express.Router();

const controller =
    require('../controllers/orderDetailController');


// GET /orders/1/details
router.get(
    '/:orderId/details',
    controller.index
);


// GET /orders/1/details/create
router.get(
    '/:orderId/details/create',
    controller.createForm
);


// POST /orders/1/details/create
router.post(
    '/:orderId/details/create',
    controller.create
);


// GET /orders/1/details/edit/2
router.get(
    '/:orderId/details/edit/:productId',
    controller.editForm
);


// POST /orders/1/details/edit/2
router.post(
    '/:orderId/details/edit/:productId',
    controller.update
);


// POST /orders/1/details/delete/2
router.post(
    '/:orderId/details/delete/:productId',
    controller.remove
);


module.exports = router;