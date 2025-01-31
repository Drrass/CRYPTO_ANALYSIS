// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const cryptoRoutes = require('./routes/cryptoRoutes');
const axios = require('axios');
const cron = require('node-cron');
const { generateRSISignals, fetchHistoricalData, calculateMACD, calculateSMA } = require('./services/cryptoService');
const { sendEmailAlert } = require('./services/alertService');
const { sendSmsAlert } = require('./services/smsService');
const saveSignalToFirestore = require('./services/signalService');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse incoming JSON

// Routes
app.use('/api/crypto', cryptoRoutes);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');

  const closingPrices = []; // Array to store recent closing prices

  const fetchRealTimePrice = async () => {
    try {
      const response = await axios.get('https://api.binance.com/api/v3/ticker/price', {
        params: { symbol: 'BTCUSDT' },
      });
      const priceData = response.data;
      socket.emit('priceUpdate', { symbol: priceData.symbol, price: priceData.price });

      // Add the latest price to the closingPrices array
      closingPrices.push(parseFloat(priceData.price));
      if (closingPrices.length > 26) { // Keep enough data for MACD
        closingPrices.shift();
      }

      // Generate signals if we have enough data
      if (closingPrices.length >= 26) {
        const rsiSignals = generateRSISignals(closingPrices, 14);
        const macdSignals = calculateMACD(closingPrices);
        const sma = calculateSMA(closingPrices, 14);

        const latestRSISignal = rsiSignals[rsiSignals.length - 1];
        const latestMACDSignal = macdSignals[macdSignals.length - 1];

        if (latestRSISignal.signal === 'buy' && latestMACDSignal.MACD > latestMACDSignal.signal && closingPrices[closingPrices.length - 1] > sma[sma.length - 1]) {
          console.log(`Strong Buy Signal at price ${priceData.price}`);
          await saveSignalToFirestore('buy', priceData.price, latestRSISignal.rsi);

          // Send email and SMS notifications
          await sendEmailAlert('mehrahimanshu780@example.com', 'Strong Buy Signal', `A strong buy signal was detected at price ${priceData.price}.`);
          await sendSmsAlert('+917983428486', `Strong Buy Signal at price ${priceData.price}`);
        } else if (latestRSISignal.signal === 'sell' && latestMACDSignal.MACD < latestMACDSignal.signal && closingPrices[closingPrices.length - 1] < sma[sma.length - 1]) {
          console.log(`Strong Sell Signal at price ${priceData.price}`);
          await saveSignalToFirestore('sell', priceData.price, latestRSISignal.rsi);

          // Send email and SMS notifications
          await sendEmailAlert('recipient@example.com', 'Strong Sell Signal', `A strong sell signal was detected at price ${priceData.price}.`);
          await sendSmsAlert('+1234567890', `Strong Sell Signal at price ${priceData.price}`);
        }
      }
    } catch (error) {
      console.error('Error fetching real-time price:', error.response ? error.response.data : error.message);
    }
  };

  const interval = setInterval(fetchRealTimePrice, 5000);

  socket.on('disconnect', () => {
    clearInterval(interval);
    console.log('Client disconnected');
  });
});

// Schedule tasks to be run on the server
cron.schedule('*/5 * * * *', () => {
  console.log('Fetching data every 5 minutes');
  // Add logic to fetch and process data
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
