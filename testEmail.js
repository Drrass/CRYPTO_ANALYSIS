const { sendEmailAlert } = require('./services/alertService');

async function testEmail() {
  try {
    await sendEmailAlert(
      'mehrahimanshu780@gmail.com',
      'Test Email Alert',
      'This is a test email to verify the email alert functionality.'
    );
    console.log('Test email sent successfully.');
  } catch (error) {
    console.error('Error sending test email:', error);
  }
}

testEmail(); 