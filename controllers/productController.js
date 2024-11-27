const { validationResult } = require('express-validator');
const Product = require('../models/productModel');
const httpStatus = require('../utilities/httpStatus');

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

exports.getProducts = async (req, res) => {
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
        status: "SUCCESS",
        data: products,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
    });
};


exports.getProduct = async (req, res) => {
    try{
        const id = req.params.id;
        const product = await Product.findById(id );
        if(!product) {
            return res.status(httpStatus.NOT_FOUND).json({status : httpStatus.FAIL, message: 'Product not found'});
        }
        res.status(httpStatus.OK).json({status : httpStatus.SUCCESS, data: product});
    }
    catch(error) {
        res.status(httpStatus.BAD_REQUEST).json({status : httpStatus.ERROR, message: error.message});
    }
}

exports.createProduct = async (req, res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(httpStatus.BAD_REQUEST).json({status : httpStatus.FAIL, message: errors.array()});
        }
        const product = new Product(req.body);

        await product.save();
        res.status(httpStatus.CREATED).json({status : httpStatus.SUCCESS, message: 'Product created successfully'});
    }
    catch(error) {
        res.status(httpStatus.BAD_REQUEST).json({status : httpStatus.ERROR, message: error.message});
    }
}

exports.updateProduct = async (req, res) => {
    try{
        const id = req.params.id;
        const product = await Product.findByIdAndUpdate(id, req.body);
        if(!product) {
            return res.status(httpStatus.NOT_FOUND).json({status : httpStatus.FAIL, message: 'Product not found'});
        }
        res.status(httpStatus.OK).json({status : httpStatus.SUCCESS, message: 'Product updated successfully'});
    }
    catch(error) {
        res.status(httpStatus.BAD_REQUEST).json({status : httpStatus.ERROR, message: error.message});
    }
}

exports.deleteProduct = async (req, res) => {
    try{
        const id = req.params.id;
        const product = await Product.findByIdAndDelete(id);
        if(!product) {
            return res.status(httpStatus.BAD_REQUEST).json({status : httpStatus.FAIL, message: 'Product not found'});
        }
        res.status(httpStatus.OK).json({status : httpStatus.SUCCESS, message: 'Product deleted successfully'});
    }
    catch(error) {
        res.status(httpStatus.BAD_REQUEST).json({status : httpStatus.ERROR, message: error.message});
    }
}