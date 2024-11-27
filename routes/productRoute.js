const express = require('express');
const {getProducts, getProduct, createProduct, updateProduct, deleteProduct} = require('../controllers/productController');
const {productValidation} = require('../middlewares/validationSchema');

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(productValidation(), createProduct);

router.route('/:id')
    .get(getProduct)
    .patch(updateProduct)
    .delete(deleteProduct)

module.exports = router;
