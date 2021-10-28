const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    note: String,
    date: {
        type: Date,
        default: Date.now
    },
    categoryId: {
        type: String,
        required: true
    },
    amount: Number
});

module.exports = mongoose.model('Transactions', TransactionSchema)