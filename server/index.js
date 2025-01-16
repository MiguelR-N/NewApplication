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
    user: 'miguelflota18@gmail.com',
    pass: 'fhdo cnub shir zuha',  // Contraseña de aplicación
  },
  logger: true,  // Habilitar logs detallados
  debug: true,   // Habilitar modo depuración
});

// Function to send verification email
const sendVerificationEmail = (email, code) => {
  const mailOptions = {
    from: 'miguelflota18@gmail.com',
    to: email,
    subject: 'Verification Code',
    text: `Your verification code is: ${code}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);  // Log para ver detalles
      throw error;  // Asegúrate de propagar el error para capturarlo
    } else {
      console.log('Verification email sent:', info.response);
    }
  });
};


// Route to register a user
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Validar entradas
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Generar un código de verificación
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    // Intentar enviar el correo de verificación
    await sendVerificationEmail(email, verificationCode);

    // Guardar los datos del usuario
    users[email] = { name, password, verificationCode };

    res.status(200).json({ message: 'User registered. Verification code sent.' });
  } catch (error) {
    console.error('Error during registration:', error);  // Mostrar error en consola
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});


// Route to verify a user
app.post('/api/verify', (req, res) => {
  const { email, code } = req.body;

  // Verificar si el usuario existe y si el código es correcto
  if (users[email] && users[email].verificationCode === parseInt(code)) {
    // El código es válido, eliminamos el código de verificación
    delete users[email].verificationCode;

    // Responder con éxito
    res.status(200).json({ message: 'User verified successfully.' });
  } else {
    // El código no es válido
    res.status(400).json({ message: 'Invalid verification code or email.' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
