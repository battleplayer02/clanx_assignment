// models/stock.js
const mongoose = require('mongoose');

// Define the schema for the stock
const stockSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
        unique: true
    },
    currentPrice: {
        type: Number,
        required: true
    }
}, { timestamps: true });

// Create the Stock model
const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
