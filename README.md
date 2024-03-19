# Backend Engineer Assignment: Portfolio API

## Introduction
This assignment involves creating a portfolio tracking API that allows adding, deleting, and updating trades, and can perform basic return calculations. For simplicity, assume there will be only one portfolio and one user.

## Portfolio Structure
The portfolio consists of stocks, with each stock having multiple trades (buy/sell). Each trade includes information such as the date, price, and type (buy/sell).

### Example Portfolio
- **RELIANCE:**
  - BUY 100@900 10/04/2015 
  - SELL 50@1000 10/05/2015 
  - BUY 100@850 10/06/2015

- **HDFCBANK:**
  - BUY 200@1000 11/05/2015 
  - SELL 100 @800 12/07/2015

### Holdings
- **RELIANCE:** 150 @ 875.5 (Average of all buys) 
- **HDFCBANK:** 100 @ 1000

## API Functionality
- Retrieve the portfolio
- Add/delete/modify trades
- Get the average buying price and cumulative return
- Calculate the average buying price as the average of all buys disregarding sells.

## API Routes
| Route         | Method | Params | Response                               |
|---------------|--------|--------|----------------------------------------|
| /portfolio    | GET    | -      | Return the entire portfolio with trades|
| /holdings     | GET    | -      | Get holdings in an aggregate view      |
| /returns      | GET    | -      | Get cumulative returns                 |
| /addTrade     | POST   | trade  | -                                      |
| /updateTrade  | POST   | trade  | -                                      |
| /removeTrade  | POST   | trade  | -                                      |

### Expected Response (JSON)
```json
{
  "success": true,
  "data": {}
}




```Folder Structure
```
project-folder/
│
├── models/
│   ├── trade.js
│   └── portfolio.js
│
├── controllers/
│   ├── tradeController.js
│   └── portfolioController.js
│
├── routes/
│   ├── tradeRoutes.js
│   └── portfolioRoutes.js
│
├── middlewares/
│   └── errorHandler.js
│
├── config/
│   └── config.js
│
├── utils/
│   └── utils.js
│
├── app.js
└── .env
```