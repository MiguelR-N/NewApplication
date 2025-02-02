const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173' })); // Permitir solicitudes desde el frontend

// Inicializar Prisma con logs para depuración
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Probar la conexión a la base de datos
prisma.$connect()
  .then(() => console.log('Conectado a la base de datos correctamente'))
  .catch(err => console.error('Error de conexión a la base de datos:', err));

// Configurar nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'miguelflota18@gmail.com', // Tu correo de Gmail
    pass: 'wkzx pgqm fizs jpge', // Usa una contraseña de aplicación
  },
  logger: true,  // Habilita logs para ver más detalles
  debug: true,   // Habilita el debug para la depuración
});

// Función para enviar el correo de verificación
const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: 'miguelflota18@gmail.com',
    to: email,
    subject: 'Verification Code',
    text: `Your verification code is: ${code}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo de verificación enviado:', info.response);
  } catch (err) {
    console.error('Error al enviar el correo de verificación:', err);
    // Arrojar el error para que el bloque try-catch del endpoint lo capture
    throw new Error('Error al enviar el correo de verificación');
  }
};

// Ruta para registrar a un usuario
app.post('/api/register', async (req, res) => {
  // Imprimir el cuerpo de la solicitud para depuración
  console.log('Datos recibidos:', req.body);

  const { name, lastname, email, password } = req.body;

  // Validación básica de campos
  if (!name || !lastname || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Verificar si el correo ya está registrado
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generar un código de verificación
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    console.log('Código de verificación generado:', verificationCode);

    // Guardar al usuario en la base de datos
    const newUser = await prisma.user.create({
      data: {
        name,
        lastname,
        email,
        password: hashedPassword,
        verificationCode: verificationCode.toString(),
      },
    });

    console.log('Nuevo usuario creado:', newUser);

    // Enviar el correo de verificación (si falla, se arroja el error)
    await sendVerificationEmail(email, verificationCode);

    // Responder con éxito
    res.status(200).json({ message: 'User registered successfully. Verification code sent.' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});

// Ruta para verificar el código de verificación
app.post('/api/verify', async (req, res) => {
  console.log('Verificación - Datos recibidos:', req.body);

  const { email, verificationCode } = req.body;

  if (!email || !verificationCode) {
    return res.status(400).json({ message: 'Email and verification code are required.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Verificar si el código de verificación es correcto
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: 'Invalid verification code.' });
    }

    // Marcar al usuario como verificado (limpiar el código)
    await prisma.user.update({
      where: { email },
      data: { verificationCode: '' },
    });

    res.status(200).json({ success: true, message: 'Verification successful.' });
  } catch (error) {
    console.error('Error during verification:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
