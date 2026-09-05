const orderModel =
    require('../models/orderModel');

const orderDetailModel =
    require('../models/orderDetailModel');

const productModel =
    require('../models/productModel');


// 顯示訂單明細
async function index(req, res) {

    try {

        const { orderId } = req.params;

        const order =
            await orderModel.getOrderById(orderId);

        if (!order) {

            return res.status(404).send(
                '找不到訂單'
            );

        }

        const details =
            await orderDetailModel
                .getDetailsByOrderId(orderId);

        const orderTotal =
            await orderDetailModel
                .getOrderTotal(orderId);

        res.render('order_details/index', {
            order,
            details,
            orderTotal
        });

    } catch (error) {

        console.error(error);

        res.status(500).send(
            '查詢訂單明細失敗'
        );

    }
}


// 新增頁面
async function createForm(req, res) {

    try {

        const { orderId } = req.params;

        const order =
            await orderModel.getOrderById(orderId);

        if (!order) {

            return res.status(404).send(
                '找不到訂單'
            );

        }

        const products =
            await productModel.getAllProducts();

        res.render('order_details/create', {
            order,
            products
        });

    } catch (error) {

        console.error(error);

        res.status(500).send(
            '載入資料失敗'
        );

    }
}


// 新增
async function create(req, res) {

    try {

        const { orderId } = req.params;

        const {
            ProductID,
            Quantity
        } = req.body;

        // 從 Products 取得價格
        const product =
            await productModel.getProductById(
                ProductID
            );

        if (!product) {

            return res.status(404).send(
                '找不到商品'
            );

        }

        await orderDetailModel.createDetail(
            orderId,
            ProductID,
            product.UnitPrice,
            Quantity
        );

        res.redirect(
            `/orders/${orderId}/details`
        );

    } catch (error) {

        console.error(error);

        if (error.code === 'ER_DUP_ENTRY') {

            return res.status(400).send(
                '此商品已存在於訂單中'
            );

        }

        res.status(500).send(
            '新增訂單明細失敗'
        );

    }
}


// 修改頁面
async function editForm(req, res) {

    try {

        const {
            orderId,
            productId
        } = req.params;

        const detail =
            await orderDetailModel.getDetail(
                orderId,
                productId
            );

        if (!detail) {

            return res.status(404).send(
                '找不到訂單明細'
            );

        }

        res.render('order_details/edit', {
            detail
        });

    } catch (error) {

        console.error(error);

        res.status(500).send(
            '查詢明細失敗'
        );

    }
}


// 修改
async function update(req, res) {

    try {

        const {
            orderId,
            productId
        } = req.params;

        const {
            Quantity
        } = req.body;

        await orderDetailModel.updateDetail(
            orderId,
            productId,
            Quantity
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


// 刪除
async function remove(req, res) {

    try {

        const {
            orderId,
            productId
        } = req.params;

        await orderDetailModel.deleteDetail(
            orderId,
            productId
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


module.exports = {
    index,
    createForm,
    create,
    editForm,
    update,
    remove
};