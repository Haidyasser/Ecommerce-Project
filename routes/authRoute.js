const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');
const { userValidation } = require('../middlewares/validationSchema');

router.route('/login')
    .post(login);

router.route('/register')
    .post(userValidation(), register);

module.exports = router;