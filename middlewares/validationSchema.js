const {body} = require('express-validator');

exports.productValidation = () => [
        body('name').isLength({min: 3}).withMessage('Name should be at least 3 characters long'),
        body('price').isFloat().withMessage('Price should be a float number'),
        body('category').isLength({min: 3}).withMessage('Category should be at least 3 characters long'),
        body('description').optional(),
        body('image').isURL().withMessage('Image should be a URL')
    ]

exports.userValidation = () => [
    body('firstName').isLength({min: 3}).withMessage('First name should be at least 3 characters long'),
    body('lastName').isLength({min: 3}).withMessage('Last name should be at least 3 characters long'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min: 6}).withMessage('Password should be at least 6 characters long'),
    body('role').optional().isIn(['admin', 'user']).withMessage('Role should be either admin or user')
]