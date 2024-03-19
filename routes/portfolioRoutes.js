const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

// Route to retrieve the entire portfolio with trades
router.get('/', portfolioController.getPortfolio);

// Route to get holdings in an aggregate view
router.get('/holdings', portfolioController.getHoldings);

// Route to get the returns
router.get('/returns', portfolioController.getReturns);

module.exports = router;
