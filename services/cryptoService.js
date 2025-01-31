const axios = require('axios');
const { RSI, SMA, MACD, BollingerBands } = require('technicalindicators');

const BINANCE_API_URL = 'https://api.binance.com';

async function fetchCryptoPrices(cryptoIds) {
  // If this function was using CoinGecko, you can remove it or update it to use Binance if needed.
}

async function fetchHistoricalData(symbol, interval, limit) {
  const response = await axios.get('https://api.binance.com/api/v3/klines', {
    params: {
      symbol: symbol,
      interval: interval,
      limit: limit,
    },
  });
  return response.data.map(candle => ({
    openTime: candle[0],
    open: parseFloat(candle[1]),
    high: parseFloat(candle[2]),
    low: parseFloat(candle[3]),
    close: parseFloat(candle[4]),
    volume: parseFloat(candle[5]),
  }));
}

async function fetchBinanceHistoricalData(symbol, interval, startTime, endTime) {
  try {
    const response = await axios.get(`${BINANCE_API_URL}/api/v3/klines`, {
      params: {
        symbol,
        interval,
        startTime,
        endTime,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error fetching historical data from Binance:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });
    } else {
      console.error('Error fetching historical data from Binance:', error.message);
    }
    throw error;
  }
}

function calculateRSI(closingPrices, period) {
  return RSI.calculate({ period, values: closingPrices });
}

function generateRSISignals(closingPrices, period) {
  const rsiValues = calculateRSI(closingPrices, period);
  const signals = [];

  rsiValues.forEach((rsi, index) => {
    if (rsi < 30) {
      signals.push({ index, signal: 'buy', rsi });
    } else if (rsi > 70) {
      signals.push({ index, signal: 'sell', rsi });
    }
  });

  return signals;
}

function calculateSMA(closingPrices, period) {
  return SMA.calculate({ period, values: closingPrices });
}

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

function calculateBollingerBands(closingPrices, period, stdDev) {
  return BollingerBands.calculate({
    period,
    values: closingPrices,
    stdDev,
  });
}

module.exports = {
  fetchCryptoPrices,
  fetchHistoricalData,
  fetchBinanceHistoricalData,
  generateRSISignals,
  calculateSMA,
  calculateMACD,
  calculateBollingerBands,
}; 