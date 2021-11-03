const mongoose = require('mongoose');

const UserLoginSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('UsersLogin', UserLoginSchema);