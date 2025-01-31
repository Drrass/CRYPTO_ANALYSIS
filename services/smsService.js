const twilio = require('twilio');

// Load environment variables
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

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
