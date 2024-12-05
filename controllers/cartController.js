const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const createError = require('http-errors');
const { Status, Code } = require('../utils/httpStatus');

exports.getCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }, { "__v": false });
        if (!cart) throw createError.NotFound("Cart not found");

        res.status(Code.OK).json({ status: Status.SUCCESS, data: cart });
    } catch (error) {
        next(error);
    }
};

exports.getCarts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const carts = await Cart.find({}, { "__v": false })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        const total = await Cart.countDocuments();
        res.status(Code.OK).json({
            status: Status.SUCCESS,
            data: carts,
            meta: { total, page, limit }
        });
    } catch (error) {
        next(error);
    }
};

exports.createCart = async (req, res, next) => {
    try {
        const products = req.body.products;

        // Validate products array
        if (!products || !Array.isArray(products) || products.length === 0) {
            throw createError.BadRequest("Products array is required");
        }

        // Validate product IDs
        const productIds = products.map(p => p.productId);
        const uniqueProductIds = [...new Set(productIds)]; // Ensure no duplicate IDs in the request
        const existingProducts = await Product.find({ _id: { $in: uniqueProductIds } });

        if (existingProducts.length !== uniqueProductIds.length) {
            throw createError.BadRequest("One or more products are invalid");
        }

        // Check for existing cart
        const cartExist = await Cart.findOne({ userId: req.user.id });
        if (cartExist) throw createError.BadRequest("Cart already exists");

        // Create the cart
        const cart = new Cart({
            ...req.body,
            userId: req.user.id
        });
        await cart.save();

        res.status(Code.CREATED).json({
            status: Status.SUCCESS,
            data: cart
        });
    } catch (error) {
        next(error);
    }
};

exports.pushToCart = async (req, res, next) => {
    try {
        const { products } = req.body;
        if (!products || !Array.isArray(products) || products.length === 0) {
            throw createError.BadRequest("Products array is required");
        }
        // Validate product IDs in bulk
        const productIds = products.map(p => p.productId);
        const uniqueProductIds = [...new Set(productIds)];
        const existingProducts = await Product.find({ _id: { $in: uniqueProductIds } });

        if (existingProducts.length !== uniqueProductIds.length)
            throw createError.BadRequest("One or more products are invalid");

        // Find the cart
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            throw createError.NotFound("Cart not found");
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

        res.status(Code.OK).json({
            status: "success",
            data: cart
        });
    } catch (error) {
        next(error);
    }
};

exports.removeFromCart = async (req, res, next) => {
    try {
        // Find the cart
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) throw createError.NotFound("Cart not found");

        // Validate the product ID
        if (!req.body.productId) throw createError.BadRequest("Product ID is required");

        // Check if the product exists in the cart
        const existingProduct = cart.products.find(
            p => p.productId.toString() === req.body.productId
        );

        if (!existingProduct) throw createError.BadRequest("Product not found in the cart");

        // Remove the product from the cart
        const updatedProducts = cart.products.filter(
            p => p.productId.toString() !== req.body.productId
        );

        cart.products = updatedProducts;
        await cart.save();

        res.status(Code.OK).json({
            status: Status.SUCCESS,
            data: cart
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteCart = async (req, res, next) => {
    try {
        const deleteCart = await Cart.findByIdAndDelete(req.params.id);
        if (!deleteCart) throw createError.NotFound("Cart not found");
        res.status(Code.OK).json({ status: Status.SUCCESS, message: "Cart deleted successfully" });
    } catch (error) {
        next(error);
    }
};

exports.placeOrder = async (req, res, next) => {
    try {
        // get items from cart
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) throw createError.NotFound("Cart not found");
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

        res.status(Code.CREATED).json({ status: Status.SUCCESS, data: order });
    } catch (error) {
        next(error);
    }
};
