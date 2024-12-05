const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const { Code, Status } = require('../utils/httpStatus');
const createError = require('http-errors');

exports.getOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const orders = await Order.find({}, { "__v": false })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        const total = await Order.countDocuments();
        res.status(Code.OK).json({
            status: Status.SUCCESS,
            data: orders,
            meta: { total, page, limit }
        });
    } catch (error) {
        next(error);
    }
};

exports.orderHistory = async (req, res, next) => {
    try {
        const order = await Order.findOne({ userId: req.user.id }, { "__v": false });
        if (!order) {
            throw createError.NotFound("OrderNotFoundError");
        }
        res.status(Code.OK).json({ status: Status.SUCCESS, data: order });
    } catch (error) {
        next(error);
    }
};

exports.getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id, { "__v": false });
        if (!order) {
            throw createError.NotFound("OrderNotFoundError");
        }
        res.status(Code.OK).json({ status: Status.SUCCESS, data: order });
    } catch (error) {
        next(error);
    }
};

exports.createOrder = async (req, res, next) => {
    try {
        const products = req.body.products;
        if (!products || !Array.isArray(products) || products.length === 0) {
            throw createError.BadRequest("ProductsArrayRequiredError");
        }
        for (let i = 0; i < products.length; i++) {
            const product = await Product.findById(products[i].productId);
            if (!product) {
                throw createError.BadRequest("ProductNotFoundError");
            }
        }
        req.body.userId = req.user.id;
        const order = new Order(req.body);
        await order.save();
        res.status(Code.CREATED).json({ status: Status.SUCCESS, data: order });
    } catch (error) {
        next(error);
    }
};

exports.updateOrder = async (req, res, next) => {
    try {
        const products = req.body.products;
        if (products && Array.isArray(products) && products.length > 0) {
            for (let i = 0; i < products.length; i++) {
                const product = await Product.findById(products[i].productId);
                if (!product) {
                    throw createError.BadRequest("ProductNotFoundError");
                }
            }
        }
        const updateOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updateOrder) {
            throw createError.NotFound("OrderNotFoundError");
        }
        res.status(Code.OK).json({ status: Status.SUCCESS, data: updateOrder });
    } catch (error) {
        next(error);
    }
};

exports.deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            throw createError.NotFound("OrderNotFoundError");
        }
        res.status(Code.OK).json({ status: Status.SUCCESS, message: "Order deleted successfully" });
    } catch (error) {
        next(error);
    }
};
