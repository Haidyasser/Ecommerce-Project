const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    fistName:{
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    lastName:{
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: [validator.isEmail, 'Invalid email']
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    role:{
        type: String,
        emun: ['admin', 'user'],
        default: 'user'
    },
    token:{
        type: String
    }
});

module.exports = mongoose.model('User', userSchema);