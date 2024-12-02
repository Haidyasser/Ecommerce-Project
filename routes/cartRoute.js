const express = require('express');
const router = express.Router();
const {verifyTokenAdmin, verifyTokenAndAuthorized} = require('../middlewares/verifyToken');
const {createCart, getCart, pushToCart, removeFromCart, deleteCart, getCarts, placeOrder} = require('../controllers/cartController');

router.route('/')
    .get(verifyTokenAdmin, getCarts)
    .post(verifyTokenAndAuthorized, createCart);

router.route('/:id')
    .delete(verifyTokenAndAuthorized, deleteCart);

router.route('/find')
    .get(verifyTokenAndAuthorized, getCart);

router.route('/push')
    .put(verifyTokenAndAuthorized, pushToCart);

router.route('/remove')
    .put(verifyTokenAndAuthorized, removeFromCart);

router.route('/placeOrder')
    .post(verifyTokenAndAuthorized, placeOrder);

module.exports = router;
