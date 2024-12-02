const  mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    products: { 
        type: [ 
            { 
                productId: mongoose.Schema.Types.ObjectId, 
                quantity: { type: Number, default: 1 } 
            } 
        ], 
        default: [] 
    },
}, { timestamps: true });


module.exports = mongoose.model('Cart', cartSchema);