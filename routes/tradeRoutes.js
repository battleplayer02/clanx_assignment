const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController');

// Route to add a new trade
router.post('/addTrade', tradeController.addTrade);

// Route to update an existing trade
router.post('/updateTrade', tradeController.updateTrade);

// Route to remove a trade
router.post('/removeTrade', tradeController.removeTrade);


// Route to get all trades
router.get('/getAllTrades', tradeController.getAllTrades);

module.exports = router;
