const jwt = require('jsonwebtoken');

module.exports = async (payload) => {
    return jwt.sign(
        payload, 
        process.env.SECRET_KEY,
        {expiresIn: '1h'}
    );
}