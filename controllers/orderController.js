const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const httpStatus = require('../utils/httpStatus');

exports.getOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const orders = await Order.find({}, { "__v": false })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        const total = await Order.countDocuments();
        res.status(httpStatus.OK).json({
             status: httpStatus.SUCCESS,
             data: orders,
             meta: { total, page, limit } 
        });
    }
    catch (error) {
        res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.ERROR, message: error.message });
    }
}

exports.orderHistory = async (req, res) => {
    try {
        const order = await Order.findOne({ userId: req.user.id }, { "__v": false });
        if (!order) {
            return res.status(httpStatus.NOT_FOUND).json({ status: httpStatus.FAIL, message: "Order not found" });
        }
        res.status(httpStatus.OK).json({ status: httpStatus.SUCCESS, data: order });
    }
    catch (error) {
        res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.ERROR, message: error.message });
    }
}

exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id, { "__v": false });
        if (!order) {
            return res.status(httpStatus.NOT_FOUND).json({ status: httpStatus.FAIL, message: "Order not found" });
        }
        res.status(httpStatus.OK).json({ status: httpStatus.SUCCESS, data: order });
    }
    catch (error) {
        res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.ERROR, message: error.message });
    }
}

exports.createOrder = async (req, res) => {
    try {
        const products = req.body.products;
        for (let i = 0; i < products.length; i++) {
            const product = await Product.findById(products[i].productId);
            if (!product) {
                return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.FAIL, message: "Product not found" });
            }
        }
        req.body.userId = req.user.id;
        const order = new Order(req.body);
        await order.save();
        res.status(httpStatus.CREATED).json({ status: httpStatus.SUCCESS, data: order });
    }
    catch (error) {
        res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.ERROR, message: error.message });
    }
}

exports.updateOrder = async (req, res) => {
    try {
        const products = req.body.products;
        for (let i = 0; i < products.length; i++) {
            const product = await Product.findById(products[i].productId);
            if (!product) {
                return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.FAIL, message: "Product not found" });
            }
        }
        const updateOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updateOrder) {
            return res.status(httpStatus.NOT_FOUND).json({ status: httpStatus.FAIL, message: "Order not found" });
        }
        res.status(httpStatus.OK).json({ status: httpStatus.SUCCESS, data: updateOrder });
    }
    catch (error) {
        res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.ERROR, message: error.message });
    }
}

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(httpStatus.NOT_FOUND).json({ status: httpStatus.FAIL, message: "Order not found" });
        }
        res.status(httpStatus.OK).json({ status: httpStatus.SUCCESS, message: "Order deleted successfully" });
    }
    catch (error) {
        res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.ERROR, message: error.message });
    }
}