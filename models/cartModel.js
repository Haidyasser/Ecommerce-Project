const  mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    products: {
        type: [
            {
                productId: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);