const jwt = require('jsonwebtoken');
const generateAccessToken = (user) => {
    return jwt.sign(
        { userId: user.id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { userId: user.id, email: user.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
    );
};

module.exports = {
    generateAccessToken,
    generateRefreshToken
};