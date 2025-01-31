function backtestRSIStrategy(closingPrices, period) {
  const signals = generateRSISignals(closingPrices, period);
  let balance = 1000; // Starting balance
  let position = 0; // Current position (0 means no position)
  let tradeLog = [];

  signals.forEach((signal, index) => {
    const price = closingPrices[index];
    if (signal.signal === 'buy' && position === 0) {
      position = balance / price;
      balance = 0;
      tradeLog.push({ action: 'buy', price, index });
    } else if (signal.signal === 'sell' && position > 0) {
      balance = position * price;
      position = 0;
      tradeLog.push({ action: 'sell', price, index });
    }
  });

  return { finalBalance: balance, tradeLog };
}

module.exports = {
  backtestRSIStrategy,
}; 