const mongoose = require('mongoose');

const User = mongoose.model('User');

exports.createUser = async function createUser(data) {
    const user = new User(data);
    return user.save();
};

exports.findOneByEmail = async function findOneByEmail(email) {
    const res = await User.findOne({ email }, 'name email role');
    return res;
};