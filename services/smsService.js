const twilio = require('twilio');

// Use environment variables for security (recommended)
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC8ec44507f38cd706ccf87f39b389f71b';
const authToken = process.env.TWILIO_AUTH_TOKEN || '364c524a7ae16a61a33073840d2c2a28';
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || '+18312655211';
const myPhoneNumber = '+917983428486';
const client = twilio(accountSid, authToken);

async function sendSmsAlert(to, message) {
  try {
    const response = await client.messages.create({
      body: message,
      from: twilioPhoneNumber, // Your Twilio phone number
      to: to, // Recipient's phone number
    });
    console.log('✅ SMS sent successfully:', response.sid);
  } catch (error) {
    console.error('❌ Error sending SMS:', error.message);
  }
}

module.exports = { sendSmsAlert };
