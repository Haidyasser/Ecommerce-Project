const express = require('express');
const router = express.Router();
const {verifyTokenAdmin, verifyTokenAndAuthorized} = require('../middlewares/verifyToken');
const {createCart, getCart, updateCart, deleteCart, getCarts} = require('../controllers/cartController');

router.route('/')
    .get(verifyTokenAdmin, getCarts)
    .post(verifyTokenAndAuthorized, createCart);

router.route('/:id')
    .patch(verifyTokenAndAuthorized, updateCart)
    .delete(verifyTokenAndAuthorized, deleteCart);

router.route('/:userId')
    .get(verifyTokenAndAuthorized, getCart);

module.exports = router;
