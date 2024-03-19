const { findMissingFields, updateStockPrice } = require('../helpers');
const Portfolio = require('../models/portfolio');
const Trade = require('../models/trade');

exports.addTrade = async (req, res) => {
    try {
        const { stock, type, quantity, price, date } = req.body;
        const missingFields = findMissingFields({ stock, type, quantity, price, date });

        if (missingFields.length > 0) {
            return res.status(400).json({ success: false, error: `Missing required fields: ${missingFields.join(', ')}` });
        }

        // Access user information from request
        const userId = req.user._id;
        const username = req.user.username;

        // Check if the portfolio for the user exists
        let portfolio = await Portfolio.findOne({ userid: userId });

        // If portfolio doesn't exist, create a new one
        if (!portfolio) {
            portfolio = new Portfolio({ userid: userId, trades: [] });
            await portfolio.save();
        }

        // Create a new trade with user details
        const trade = new Trade({ stock, type, quantity, price, date, userId, username });
        await trade.save();

        // Add the new trade to the portfolio
        portfolio.trades.push(trade._id);
        await portfolio.save();

        updateStockPrice(trade);

        res.status(201).json({ success: true, data: trade });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
// Controller function to update an existing trade
exports.updateTrade = async (req, res) => {
    try {
        const { id, stock, type, quantity, price, date } = req.body;

        const missingFields = findMissingFields({ stock, type, quantity, price, date });
        if (missingFields.length > 0) {
            return res.status(400).json({ success: false, error: `Missing required fields: ${missingFields.join(', ')}` });
        }
        // add validation for user id
        const userId = req.user._id;

        // get the trade and check if the user id matches
        const trade = await Trade.findById(id);
        if (!trade) {
            return res.status(404).json({ success: false, error: "Trade not found" });
        }


        if (trade.userId != userId) {
            return res.status(403).json({ success: false, error: "You are not authorized to update this trade" });
        }

        // Update the trade
        const updatedTrade = await Trade
            .findByIdAndUpdate(id, { stock, type, quantity, price, date }, { new: true });


        // If trade is not found, return 404
        if (!updatedTrade) {
            return res.status(404).json({ success: false, error: "Trade not found" });
        }

        updateStockPrice(updatedTrade);
        res.json({ success: true, data: updatedTrade });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Controller function to remove a trade
exports.removeTrade = async (req, res) => {
    try {
        const { id } = req.body;
        const userId = req.user._id;

        const trade = await Trade.findById(id);
        if (!trade) {
            return res.status(404).json({ success: false, error: "Trade not found" });
        }

        if (trade.userId != userId) {
            return res.status(403).json({ success: false, error: "You are not authorized to remove this trade" });
        }
        
        // Remove the trade from the database
        const deletedTrade = await Trade.findByIdAndDelete(id);
        if (!deletedTrade) {
            return res.status(404).json({ success: false, error: "Trade not found" });
        }

        // Remove the trade from the user's portfolio
        const portfolio = await Portfolio.findOne({ userid: userId });
        portfolio.trades = portfolio.trades.filter(tradeId => tradeId != id);
        await portfolio.save();

        res.json({ success: true, message: "Trade removed successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Controller function to get all trades of the logged-in user
exports.getAllTrades = async (req, res) => {
    try {
        let { page, perPage, from, to } = req.query;
        page = parseInt(page) || 1;
        perPage = parseInt(perPage) || 10;
        const query = { userId: req.user._id }; // Filter by user ID

        // Apply date range filter if provided
        if (from && to) {
            query.date = { $gte: new Date(from), $lte: new Date(to) };
        }

        const totalTrades = await Trade.countDocuments(query);
        const totalPages = Math.ceil(totalTrades / perPage);
        const offset = (page - 1) * perPage;

        const trades = await Trade.find(query)
            .skip(offset)
            .limit(perPage);

        res.json({
            success: true,
            data: trades,
            pagination: {
                totalTrades,
                totalPages,
                currentPage: page,
                perPage
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
