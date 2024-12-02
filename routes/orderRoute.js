const express = require('express');
const router = express.Router();
const {verifyTokenAdmin, verifyTokenAndAuthorized} = require('../middlewares/verifyToken');
const {createOrder, getOrder, updateOrder, deleteOrder, getOrders, orderHistory} = require('../controllers/orderController');

router.route('/')
    .get(verifyTokenAdmin, getOrders)
    .post(verifyTokenAndAuthorized, createOrder);

router.route('/:id')
    .patch(verifyTokenAndAuthorized, updateOrder)
    .delete(verifyTokenAndAuthorized, deleteOrder);

router.route('/find/:id')
    .get(verifyTokenAndAuthorized, getOrder);

router.route('/history')
    .get(verifyTokenAndAuthorized, orderHistory);

module.exports = router;