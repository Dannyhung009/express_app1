const orderModel = require('../models/orderModel');


// Orders 列表
async function index(req, res) {

    try {

        const orders =
            await orderModel.getAllOrders();

        res.render('orders/index', {
            orders
        });

    } catch (error) {

        console.error(error);

        res.status(500).send(
            '查詢訂單失敗'
        );

    }
}


// 新增頁面
function createForm(req, res) {

    res.render('orders/create');

}


// 新增
async function create(req, res) {

    try {

        const {
            CustomerID,
            OrderDate
        } = req.body;

        await orderModel.createOrder(
            CustomerID,
            OrderDate
        );

        res.redirect('/orders');

    } catch (error) {

        console.error(error);

        res.status(500).send(
            '新增訂單失敗'
        );

    }
}


// 修改頁面
async function editForm(req, res) {

    try {

        const { id } = req.params;

        const order =
            await orderModel.getOrderById(id);

        if (!order) {

            return res.status(404).send(
                '找不到訂單'
            );

        }

        res.render('orders/edit', {
            order
        });

    } catch (error) {

        console.error(error);

        res.status(500).send(
            '查詢訂單失敗'
        );

    }
}


// 修改
async function update(req, res) {

    try {

        const { id } = req.params;

        const {
            CustomerID,
            OrderDate
        } = req.body;

        await orderModel.updateOrder(
            id,
            CustomerID,
            OrderDate
        );

        res.redirect('/orders');

    } catch (error) {

        console.error(error);

        res.status(500).send(
            '修改訂單失敗'
        );

    }
}


// 刪除
async function remove(req, res) {

    try {

        const { id } = req.params;

        await orderModel.deleteOrder(id);

        res.redirect('/orders');

    } catch (error) {

        console.error(error);

        res.status(500).send(
            '刪除訂單失敗'
        );

    }
}


module.exports = {
    index,
    createForm,
    create,
    editForm,
    update,
    remove
};