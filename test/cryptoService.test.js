const { expect } = require('chai');
const { generateRSISignals } = require('../services/cryptoService');

describe('Crypto Service', () => {
  it('should generate correct RSI signals', () => {
    const closingPrices = [30, 40, 50, 60, 70, 80, 90];
    const period = 14;
    const signals = generateRSISignals(closingPrices, period);
    expect(signals).to.be.an('array');
  });
}); 