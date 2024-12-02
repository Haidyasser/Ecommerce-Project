const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const {BAD_REQUEST, CREATED, OK, NOT_FOUND, ERROR, SUCCESS, FAIL} = require('../utils/httpStatus');
const { parse } = require('dotenv');

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }, { "__v": false });
        if (!cart) {
            return res.status(NOT_FOUND).json({ status: FAIL, message: "Cart not found" });
        }
        res.status( OK).json({ status: SUCCESS, data: cart });
    }
    catch (error) {
        res.status(BAD_REQUEST).json({ status: ERROR, message: error.message });
    }
}

exports.getCarts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const carts = await Cart.find({}, { "__v": false })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        const total = await Cart.countDocuments();
        res.status(OK).json({ 
            status: SUCCESS, 
            data: carts, 
            meta: { total, page, limit } 
        });

    }
    catch (error) {
        res.status(BAD_REQUEST).json({ status: ERROR, message: error.message });
    }
}

exports.createCart = async (req, res) => {
    try {
        const products = req.body.products;

        // Validate products array
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(BAD_REQUEST).json({
                 status: FAIL, message: "Products array is required" 
            });
        }

        // Validate product IDs
        const productIds = products.map(p => p.productId);
        const uniqueProductIds = [...new Set(productIds)]; // Ensure no duplicate IDs in the request
        const existingProducts = await Product.find({ _id: { $in: uniqueProductIds } });

        if (existingProducts.length !== uniqueProductIds.length) {
            return res.status(BAD_REQUEST).json({ 
                status: "fail", 
                message: "One or more products are invalid" 
            });
        }

        // Check for existing cart
        const cartExist = await Cart.findOne({ userId: req.user.id });
        if (cartExist) {
            return res.status(BAD_REQUEST).json({ 
                status: "fail", 
                message: "Cart already exists" 
            });
        }

        // Create the cart
        const cart = new Cart({
            ...req.body,
            userId: req.user.id
        });
        await cart.save();

        res.status(CREATED).json({ 
            status: "success", 
            data: cart 
        });
    } catch (error) {
        res.status(BAD_REQUEST).json({ 
            status: "error", 
            message: error.message 
        });
    }
};

exports.pushToCart = async (req, res) => {
    try {
        const { products } = req.body;
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(BAD_REQUEST).json({
                status: FAIL, message: "Products array is required"
            });
        }
        // Validate product IDs in bulk
        const productIds = products.map(p => p.productId);
        const uniqueProductIds = [...new Set(productIds)];
        const existingProducts = await Product.find({ _id: { $in: uniqueProductIds } });

        if (existingProducts.length !== uniqueProductIds.length) {
            return res.status(BAD_REQUEST).json({ 
                status: "fail", 
                message: "One or more products are invalid" 
            });
        }

        // Find the cart
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(NOT_FOUND).json({ 
                status: "fail", 
                message: "Cart not found" 
            });
        }

        // Merge products (avoid duplicates)
        const existingCartProducts = cart.products;
        products.forEach(newProduct => {
            const existingProduct = existingCartProducts.find(
                p => p.productId.toString() === newProduct.productId
            );

            if (existingProduct) {
                // Update quantity if product exists
                existingProduct.quantity += newProduct.quantity;
            } else {
                // Add new product
                existingCartProducts.push(newProduct);
            }
        });

        // Save updated cart
        cart.products = existingCartProducts;
        await cart.save();

        res.status(OK).json({ 
            status: "success", 
            data: cart 
        });
    } catch (error) {
        res.status(BAD_REQUEST).json({ 
            status: "error", 
            message: error.message 
        });
    }
};


exports.removeFromCart = async (req, res) => {
    try {
        // Find the cart
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(NOT_FOUND).json({
                status: "fail",
                message: "Cart not found"
            });
        }

        // Validate the product ID
        if (!req.body.productId) {
            return res.status(BAD_REQUEST).json({
                status: "fail",
                message: "Product ID is required"
            });
        }

        // Check if the product exists in the cart
        const existingProduct = cart.products.find(
            p => p.productId.toString() === req.body.productId
        );

        if (!existingProduct) {
            return res.status(BAD_REQUEST).json({
                status: "fail",
                message: "Product not found in the cart"
            });
        }

        // Remove the product from the cart
        const updatedProducts = cart.products.filter(
            p => p.productId.toString() !== req.body.productId
        );

        cart.products = updatedProducts;
        await cart.save();

        res.status(OK).json({
            status: "success",
            data: cart
        });
    } catch (error) {
        res.status(BAD_REQUEST).json({
            status: "error",
            message: error.message
        });
    }
};

exports.deleteCart = async (req, res) => {
    try {
        const deleteCart = await Cart.findByIdAndDelete(req.params.id);
        if (!deleteCart) {
            return res.status(NOT_FOUND).json({ status: FAIL, message: "Cart not found" });
        }
        res.status(OK).json({ status: SUCCESS, message: "Cart deleted successfully" });
    }
    catch (error) {
        res.status(BAD_REQUEST).json({ status: ERROR, message: error.message });
    }
}

exports.placeOrder = async (req, res) => {
    try {
        // get items from cart
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(NOT_FOUND).json({ status: FAIL, message: "Cart not found" });
        }
        let total = 0;
        for (let i = 0; i < cart.products.length; i++) {
            const product = await Product.findById(cart.products[i].productId);
            total += product.price * cart.products[i].quantity;
        }

        // create order
        const order = new Order({
            userId: req.user.id,
            products: cart.products,
            total: total,
            address: req.body.address,
            paymentType: req.body.paymentType
        });
        await order.save();

        // clear cart
        cart.products = [];
        await cart.save();

        res.status(CREATED).json({ status: SUCCESS, data: order });
    }
    catch (error) {
        res.status(BAD_REQUEST).json({ status: ERROR, message: error.message });
    }
}