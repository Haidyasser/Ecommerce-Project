const express = require('express');
const router = express.Router();
const {verifyTokenAdmin, verifyTokenAndAuthorized} = require('../middlewares/verifyToken');
const {createCart, getCart, pushToCart, removeFromCart, deleteCart, getCarts} = require('../controllers/cartController');

router.route('/')
    .get(verifyTokenAdmin, getCarts)
    .post(verifyTokenAndAuthorized, createCart);

router.route('/:id')
    .delete(verifyTokenAndAuthorized, deleteCart);

router.route('/find/:userId')
    .get(verifyTokenAndAuthorized, getCart);

router.route('/push/:userId')
    .put(verifyTokenAndAuthorized, pushToCart);

router.route('/remove/:userId')
    .put(verifyTokenAndAuthorized, removeFromCart);

module.exports = router;
