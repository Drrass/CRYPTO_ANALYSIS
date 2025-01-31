// routes/cryptoRoutes.js
const express = require('express');
const db = require('../config/firebase');
const { fetchBinanceHistoricalData, generateRSISignals } = require('../services/cryptoService');
const { SMA, RSI, MACD, BollingerBands } = require('technicalindicators');
const axios = require('axios');
const admin = require('firebase-admin');

const router = express.Router();

// Middleware to verify Firebase ID token
async function verifyToken(req, res, next) {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// Fetch and store crypto prices (if needed, update to use Binance)
router.get('/store-prices', async (req, res) => {
  const { symbol } = req.query; // e.g., BTCUSDT
  if (!symbol) {
    return res.status(400).json({ error: 'Symbol is required' });
  }

  try {
    const response = await axios.get(`${BINANCE_API_URL}/api/v3/ticker/24hr`, {
      params: { symbol },
    });
    const priceData = response.data;

    // Store price data in Firestore
    const docRef = db.collection('prices').doc(symbol);
    await docRef.set({
      symbol: priceData.symbol,
      price: priceData.lastPrice,
      high: priceData.highPrice,
      low: priceData.lowPrice,
      volume: priceData.volume,
      timestamp: new Date(),
    });

    res.json({ message: 'Price stored successfully', data: priceData });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching price from Binance' });
  }
});

// New route to get historical data from Binance
router.get('/binance-historical', async (req, res) => {
  const { symbol, interval, startTime, endTime } = req.query;
  if (!symbol || !interval || !startTime || !endTime) {
    return res.status(400).json({ error: 'Symbol, interval, startTime, and endTime are required' });
  }

  try {
    const historicalData = await fetchBinanceHistoricalData(symbol, interval, startTime, endTime);
    
    // Store data in Firestore
    const batch = db.batch();
    historicalData.forEach((dataPoint) => {
      const [openTime, open, high, low, close, volume] = dataPoint;
      const docRef = db.collection('historicalData').doc(`${symbol}-${openTime}`);
      batch.set(docRef, { openTime, open, high, low, close, volume });
    });
    await batch.commit();

    res.json(historicalData);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching historical data from Binance' });
  }
});

function calculateSMA(closingPrices, period) {
  return SMA.calculate({ period, values: closingPrices });
}

function calculateRSI(closingPrices, period) {
  return RSI.calculate({ period, values: closingPrices });
}

// Calculate MACD
function calculateMACD(closingPrices) {
  return MACD.calculate({
    values: closingPrices,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false,
  });
}

// Calculate Bollinger Bands
function calculateBollingerBands(closingPrices, period, stdDev) {
  return BollingerBands.calculate({
    period,
    values: closingPrices,
    stdDev,
  });
}

// Example of a protected route
router.get('/protected-route', verifyToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

router.get('/signals/rsi', async (req, res) => {
  const { symbol, period } = req.query;
  if (!symbol || !period) {
    return res.status(400).json({ error: 'Symbol and period are required' });
  }

  try {
    // Fetch historical closing prices for the symbol
    const closingPrices = await fetchHistoricalClosingPrices(symbol);
    const signals = generateRSISignals(closingPrices, parseInt(period, 10));
    res.json(signals);
  } catch (error) {
    res.status(500).json({ error: 'Error generating RSI signals' });
  }
});

module.exports = router;
