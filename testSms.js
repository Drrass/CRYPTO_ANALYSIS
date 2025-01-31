const { sendSmsAlert } = require('./services/smsService');

async function testSms() {
  try {
    await sendSmsAlert(
      '+917983428486', // Corrected phone number format with country code
      'This is a test SMS to verify the SMS alert functionality.'
    );
    console.log('Test SMS sent successfully.');
  } catch (error) {
    console.error('Error sending test SMS:', error);
  }
}

testSms(); 