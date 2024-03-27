const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (options) => {
  // Configure the transporter
  const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE, 
	secure:true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  // Define the email content
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: options.to,
    subject: options.subject,
    text: options.text || '', 
    html: options.html || '', 
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
