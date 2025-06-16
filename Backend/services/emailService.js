const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Read the email template
const emailTemplate = fs.readFileSync(
  path.join(__dirname, '../utilities/template/contact-us.html'),
  'utf8'
);

const sendContactEmail = async (formData) => {
  try {
    // Replace placeholders in the template
    let emailContent = emailTemplate
      .replace('{{NAME}}', formData.name)
      .replace('{{PHONE}}', formData.phone)
      .replace('{{EMAIL}}', formData.email)
      .replace('{{COMPANY}}', formData.company)
      .replace('{{COUNTRY}}', formData.country)
      .replace('{{MESSAGE}}', formData.message);

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Same as from address
      cc: process.env.EMAIL_CC, // Different CC address
      subject: 'New QUERY Form Submission',
      html: emailContent
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendContactEmail
}; 