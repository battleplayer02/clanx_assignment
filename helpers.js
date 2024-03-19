const portfolio = require("./models/portfolio");
const Stock = require("./models/stock");

// Helper function to find missing fields
const findMissingFields = (fieldsObject) => {
    const missingFields = [];
    for (const field in fieldsObject) {
        if (!fieldsObject[field]) {
            missingFields.push(field);
        }
    }
    return missingFields;
};

exports.findMissingFields = findMissingFields;


const updateStockPrice = async (trade) => {
    // update the stock price in the trade
    let stockEle = await Stock.findOne({ symbol: trade.stock });
    if (!stockEle) {
        stockEle = new Stock({ symbol: trade.stock, currentPrice: trade.price });
    } else {
        stockEle.currentPrice = trade.price;
    }
    await stockEle.save();
}

exports.updateStockPrice = updateStockPrice;


// getholdings
exports.getHoldingsOfPortfolio = async (portfolio) => {
    // create a summary of the portfolio for the user to view in the frontend {}
    let totalValue = 0;
    const holdings = {};

    if (!portfolio) {
        return res.json({ success: true, data: { totalValue, holdings } });
    }

    portfolio.trades.forEach(trade => {
        if (!holdings[trade.stock]) {
            holdings[trade.stock] = {
                quantity: 0,
                averagePrice: 0,
                holdingValue: 0
            };
        }

        holdings[trade.stock].quantity += trade.quantity;
        holdings[trade.stock].averagePrice += trade.price * trade.quantity;
    });

    for (const stock in holdings) {
        const stockEle = await Stock.findOne({ symbol: stock });
        holdings[stock].averagePrice /= holdings[stock].quantity;

        if(!stockEle) {
            console.log(`Stock ${stock} not found`);
        }
        holdings[stock].holdingValue = holdings[stock].quantity * stockEle.currentPrice;
        totalValue += holdings[stock].holdingValue;
    }


    return { totalValue, holdings };
}