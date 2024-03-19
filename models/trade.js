const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
    stock: String,
    type: String,
    quantity: Number,
    price: Number,
    date: Date,
    userId: String,
    username: String
});

module.exports = mongoose.model('Trade', tradeSchema);
