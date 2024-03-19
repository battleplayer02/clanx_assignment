const { getHoldingsOfPortfolio } = require('../helpers');
const Portfolio = require('../models/portfolio');
const Stock = require('../models/stock');

// Controller function to retrieve the entire portfolio with trades
exports.getPortfolio = async (req, res) => {
    try {
        // Access user information from request
        const userId = req.user._id;

        // Check if the portfolio for the user exists
        const portfolio = await Portfolio.findOne({ userid: userId }).populate('trades');
        res.json({ success: true, data: await getHoldingsOfPortfolio(portfolio) });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Controller function to get holdings in an aggregate view
exports.getHoldings = async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne().populate('trades');
        res.json({ success: true, data: (await getHoldingsOfPortfolio(portfolio)).holdings });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


// Controller function to get the returns
exports.getReturns = async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne().populate('trades');
        const holdings = await getHoldingsOfPortfolio(portfolio);
        let returns = 0;
        for (const stock in holdings.holdings) {
            const stockEle = await Stock.findOne({ symbol: stock });
            if (!stockEle) {
                continue;
            }

            console.log(stockEle.currentPrice, holdings.holdings[stock].averagePrice, holdings.holdings[stock].quantity);
            returns += (stockEle.currentPrice - holdings.holdings[stock].averagePrice) * holdings.holdings[stock].quantity;
        }

        res.json({ success: true, data: { returns } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};