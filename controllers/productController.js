const productModel =
    require('../models/productModel');


// 商品列表
async function index(req, res) {

    try {

        const products =
            await productModel.getAllProducts();

        res.render('products/index', {
            products
        });

    } catch (error) {

        console.error(error);

        res.status(500).send(
            '查詢商品失敗'
        );

    }
}


// 新增頁面
function createForm(req, res) {

    res.render('products/create');

}


// 新增
async function create(req, res) {

    try {

        const {
            ProductName,
            UnitPrice,
            UnitsInStock
        } = req.body;

        await productModel.createProduct(
            ProductName,
            UnitPrice,
            UnitsInStock
        );

        res.redirect('/products');

    } catch (error) {

        console.error(error);

        res.status(500).send(
            '新增商品失敗'
        );

    }
}


// 修改頁面
async function editForm(req, res) {

    try {

        const { id } = req.params;

        const product =
            await productModel.getProductById(id);

        if (!product) {

            return res.status(404).send(
                '找不到商品'
            );

        }

        res.render('products/edit', {
            product
        });

    } catch (error) {

        console.error(error);

        res.status(500).send(
            '查詢商品失敗'
        );

    }
}


// 修改
async function update(req, res) {

    try {

        const { id } = req.params;

        const {
            ProductName,
            UnitPrice,
            UnitsInStock
        } = req.body;

        await productModel.updateProduct(
            id,
            ProductName,
            UnitPrice,
            UnitsInStock
        );

        res.redirect('/products');

    } catch (error) {

        console.error(error);

        res.status(500).send(
            '修改商品失敗'
        );

    }
}


// 刪除
async function remove(req, res) {

    try {

        const { id } = req.params;

        await productModel.deleteProduct(id);

        res.redirect('/products');

    } catch (error) {

        console.error(error);

        res.status(500).send(
            '刪除商品失敗'
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