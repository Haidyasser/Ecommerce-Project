const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        required: true
    }
});

productSchema.index({name: 'text', category: 'text', description: 'text'});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;