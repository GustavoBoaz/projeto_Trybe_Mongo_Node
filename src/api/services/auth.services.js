const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = mongoose.model('User');

exports.auth = async function auth(data) {
    const res = await User.findOne({
        email: data.email,
        password: data.password,
    });
    return res;
};

exports.generateToken = function generateToken(data) {
    return jwt.sign(data, '7411358e73cf95028bfa62f0b49491b0', { expiresIn: '1d' });
};

exports.decodeToken = function decodeToken(token) {
    const data = jwt.verify(token, '7411358e73cf95028bfa62f0b49491b0');
    return data;
};

exports.authorize = function authorize(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'missing auth token' });
    }
    jwt.verify(token, '7411358e73cf95028bfa62f0b49491b0', (error) => {
        if (error) {
            return res.status(401).json({ message: 'jwt malformed' });
        }
        return next();
    });
};