const express = require('express');
const {getUsers, getUser, updateUser, deleteUser} = require('../controllers/userController');
const { verifyTokenAdmin, verifyTokenAndAuthorized } = require('../middlewares/verifyToken');

const router = express.Router();

router.route('/')
    .get(verifyTokenAdmin, getUsers);

router.route('/:id')
    .get(verifyTokenAndAuthorized, getUser)
    .patch(verifyTokenAndAuthorized, updateUser)
    .delete(verifyTokenAndAuthorized, deleteUser);


module.exports = router;