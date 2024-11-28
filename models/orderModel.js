const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    products: [
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
    status: {
        type: String,
        enum: ['pending', 'delivered', 'cancelled'],
        default: 'pending'
    },
    total: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    paymentType: {
        type: String,
        enum: ['card', 'cash'],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);