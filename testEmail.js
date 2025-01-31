const { sendEmailAlert } = require('./services/alertService');

async function testEmail() {
  try {
    await sendEmailAlert(
      'sahilsinghdev90@gmail.com', // Replace with your email address to test
      'Test Email Alert',
      'This is a test email to verify the email alert functionality.'
    );
    console.log('Test email sent successfully.');
  } catch (error) {
    console.error('Error sending test email:', error);
  }
}

testEmail(); 