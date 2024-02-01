// password-reset-server/server.js
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const users = [
  // Replace this array with your actual user database
  { email: 'user@example.com', password: 'hashedPassword' },
];

const passwordResetTokens = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your.email@gmail.com',
    pass: 'your-email-password',
  },
});

app.post('/api/reset-password', (req, res) => {
  const { email } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const token = crypto.randomBytes(20).toString('hex');
  passwordResetTokens[email] = { token, expiry: Date.now() + 3600000 }; // 1 hour expiration

  const resetLink = `http://localhost:3000/reset-password/${token}`;
  const mailOptions = {
    from: 'your.email@gmail.com',
    to: email,
    subject: 'Password Reset',
    text: `Click the following link to reset your password: ${resetLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: 'Failed to send reset email.' });
    }
    res.status(200).json({ message: 'Reset email sent successfully.' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    // Handle the root path
    res.send('Hello, this is the root path!');
  });