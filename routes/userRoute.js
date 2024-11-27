const express = require('express');
const {getUsers, login, register} = require('../controllers/userController');
const { verifyToken } = require('../middlewares/verifyToken');
const {userValidation} = require('../middlewares/validationSchema');

const router = express.Router();

router.route('/')
    .get(verifyToken, getUsers);

router.route('/login')
    .post(login);

router.route('/register')
    .post(userValidation(), register);

module.exports = router;