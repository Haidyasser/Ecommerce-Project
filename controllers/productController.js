const { validationResult } = require('express-validator');
const Product = require('../models/productModel');
const createError = require('http-errors');

const buildProductQuery = ({ search, category, minPrice, maxPrice }) => {
    const query = {};
    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    return query;
};

exports.getProducts = async (req, res, next) => {
    try {
        const { search, category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

        // Build the query
        const filters = buildProductQuery({ search, category, minPrice, maxPrice });

        // Total count
        const total = await Product.countDocuments(filters);

        // Paginated and sorted products
        const products = await Product.find(filters)
            .select("name category price description image")
            .skip((page - 1) * parseInt(limit))
            .limit(parseInt(limit));

        res.status(200).json({
            status: 'success',
            data: products,
            meta: { total, page, limit }
        });
    } catch (error) {
        next(error);
    }
};

exports.getProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        if (!product) {
            throw createError.NotFound('Product not found');
        }
        res.status(200).json({ status: 'success', data: product });
    } catch (error) {
        next(error);
    }
};

exports.createProduct = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw createError.BadRequest(errors.array());
        }
        const product = new Product(req.body);

        await product.save();
        res.status(201).json({ status: 'success', message: 'Product created successfully' });
    } catch (error) {
        next(error);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await Product.findByIdAndUpdate(id, req.body);
        if (!product) {
            throw createError.NotFound('Product not found');
        }
        res.status(200).json({ status: 'success', message: 'Product updated successfully' });
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            throw createError.NotFound('Product not found');
        }
        res.status(200).json({ status: 'success', message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};
