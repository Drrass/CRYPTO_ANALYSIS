const mongoose = require('mongoose');

const signalSchema = new mongoose.Schema({
  type: { type: String, required: true }, // 'buy' or 'sell'
  price: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  rsi: { type: Number, required: true },
});

const Signal = mongoose.model('Signal', signalSchema);

module.exports = Signal; 