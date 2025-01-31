const nodemailer = require('nodemailer');

async function sendEmailAlert(email, subject, message) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mehrahimanshu780@gmail.com',
      pass: 'Himanshu@123',
    },
  });

  const mailOptions = {
    from: 'mehrahimanshu780@gmail.com',
    to: email,
    subject: 'Alert',
    text: message,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  sendEmailAlert,
}; 