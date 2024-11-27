const express = require('express');
const {getUsers, login, register} = require('../controllers/userController');
const { verifyToken } = require('../middlewares/verifyToken');
const {userValidation} = require('../middlewares/validationSchema');
const allowedRoles = require('../middlewares/allowedRoles');

const router = express.Router();

router.route('/')
    .get(verifyToken, allowedRoles(['admin']), getUsers);

router.route('/login')
    .post(login);

router.route('/register')
    .post(userValidation(), register);

module.exports = router;