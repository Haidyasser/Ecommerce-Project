const express = require('express');
const router = express.Router();
const {verifyTokenAdmin, verifyTokenAndAuthorized} = require('../middlewares/verifyToken');
const {createOrder, getOrder, updateOrder, deleteOrder, getOrders} = require('../controllers/orderController');

router.route('/')
    .get(verifyTokenAdmin, getOrders)
    .post(verifyTokenAndAuthorized, createOrder);

router.route('/:id')
    .patch(verifyTokenAndAuthorized, updateOrder)
    .delete(verifyTokenAndAuthorized, deleteOrder);

router.route('/:userId')
    .get(verifyTokenAndAuthorized, getOrder);

module.exports = router;