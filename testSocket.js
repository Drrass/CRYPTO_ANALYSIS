const io = require('socket.io-client');

// Connect to the WebSocket server
const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('priceUpdate', (data) => {
  console.log(`Received price update: Symbol: ${data.symbol}, Price: ${data.price}`);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});