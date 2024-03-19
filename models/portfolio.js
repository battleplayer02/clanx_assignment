const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assuming 'User' model exists
    trades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trade' }]
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
