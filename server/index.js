const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer'); 

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173' })); // Allow requests from your frontend


const users = {};

// Configure nodemailer transporter with the generated application password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'miguelflota18@gmail.com',  // Mi correo de Gmail
    pass: 'nvio buxa ltxd pbgf',   // Contraseña de aplicación generada
  },
});

// Function to send verification email
const sendVerificationEmail = (email, code) => {
  const mailOptions = {
    from: 'miguelflota18@gmail.com',  // El correo desde el cual se enviará
    to: email,  // El correo del destinatario
    subject: 'Verification Code',  // Asunto del correo
    text: `Your verification code is: ${code}`,  // Cuerpo del correo
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Verification email sent:', info.response);
    }
  });
};

// Route to register a user
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Generate a verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000);

  // Send verification code email
  sendVerificationEmail(email, verificationCode);

  // Store user data in memory
  users[email] = { name, password, verificationCode };

  res.status(200).json({ message: 'User registered. Verification code sent.' });
});

// Route to verify a user
app.post('/api/verify', (req, res) => {
  const { email, code } = req.body;

  if (users[email] && users[email].verificationCode === parseInt(code)) {
    delete users[email].verificationCode; // Remove verification code after verifying
    res.status(200).json({ message: 'User verified successfully.' });
  } else {
    res.status(400).json({ message: 'Invalid verification code or email.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
