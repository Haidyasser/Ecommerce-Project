const express = require('express');
const {getProducts, getProduct, createProduct, updateProduct, deleteProduct} = require('../controllers/productController');
const {productValidation} = require('../middlewares/validationSchema');
const {verifyTokenAdmin, verifyToken} = require('../middlewares/verifyToken');

const router = express.Router();

router.route('/')
    .get(verifyToken, getProducts)
    .post(verifyTokenAdmin, productValidation(), createProduct);

router.route('/:id')
    .get(verifyToken, getProduct)
    .patch(verifyTokenAdmin, updateProduct)
    .delete(verifyTokenAdmin, deleteProduct);

module.exports = router;
