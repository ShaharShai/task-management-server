const mongoose = require('mongoose');

const schema = mongoose.Schema({
    username: {
    type: String,
    required: true,
    unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    fullname: {
        type: String
    }
})

module.exports = mongoose.model('User', schema);