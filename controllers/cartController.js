const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const httpStatus = require('../utils/httpStatus');

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }, { "__v": false });
        if (!cart) {
            return res.status(httpStatus.NOT_FOUND).json({ status: httpStatus.FAIL, message: "Cart not found" });
        }
        res.status(httpStatus.OK).json({ status: httpStatus.SUCCESS, data: cart });
    }
    catch (error) {
        res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.ERROR, message: error.message });
    }
}

exports.getCarts = async (req, res) => {
    try {
        const carts = await Cart.find({}, { "__v": false });
        res.status(httpStatus.OK).json({ status: httpStatus.SUCCESS, data: carts });
    }
    catch (error) {
        res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.ERROR, message: error.message });
    }
}

exports.createCart = async (req, res) => {
    try {
        const products = [req.body.products];
        for (let i = 0; i < products.length; i++) {
            if (!products[i]) break;
            const product = await Product.findById(products[i].productId);
            if (!product) {
                return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.FAIL, message: "Product not found" });
            }
        }
        req.body.userId = req.user.id;
        const cart = new Cart(req.body);
        await cart.save();
        res.status(httpStatus.CREATED).json({ status: httpStatus.SUCCESS, data: cart });
    }
    catch (error) {
        res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.ERROR, message: error.message });
    }
}

exports.updateCart = async (req, res) => {
    try {
        const products = [req.body.products];
        for (let i = 0; i < products.length; i++) {
            const product = await Product.findById(products[i].productId);
            if (!product) {
                return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.FAIL, message: "Product not found" });
            }
        }
        const updateCart = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updateCart) {
            return res.status(httpStatus.NOT_FOUND).json({ status: httpStatus.FAIL, message: "Cart not found" });
        }
        res.status(httpStatus.OK).json({ status: httpStatus.SUCCESS, data: updateCart });
    }
    catch (error) {
        res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.ERROR, message: error.message });
    }
}

exports.deleteCart = async (req, res) => {
    try {
        const deleteCart = await Cart.findByIdAndDelete(req.params.id);
        if (!deleteCart) {
            return res.status(httpStatus.NOT_FOUND).json({ status: httpStatus.FAIL, message: "Cart not found" });
        }
        res.status(httpStatus.OK).json({ status: httpStatus.SUCCESS, message: "Cart deleted successfully" });
    }
    catch (error) {
        res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.ERROR, message: error.message });
    }
}