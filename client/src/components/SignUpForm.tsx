import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth'; // Hook personalizado para manejar la lógica de autenticación
import InputField from './InputField'; // Componente para los campos de entrada
import { validationSchema } from './validationSchema'; // Esquema de validación con Yup
import * as Yup from "yup";
import AccountCircle from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GoogleLogo from '@mui/icons-material/Google'; // Asegúrate de importar el logo de Google
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link'; // Para el enlace de "Sign in"

// Type Errors para definir la estructura de los datos
type Errors = {
  name?: string;
  email?: string;
  password?: string;
  verificationCode?: string;
};

// Manejamos el estado 'Field' que es la que usamos para actualizar el estado de los campos 
const SignUpForm = () => {
  const navigate = useNavigate(); // El hook de react-router-dom para redirigir a diferentes rutas
  const [fields, setFields] = useState({
    name: '',
    email: '',
    password: '',
    verificationCode: '',
  });

  // Algunos hooks de estado
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  // Hooks de la lógica de autenticación personalizada, que se encuentran en 'useAuth.ts'
  const { handleSignUp, handleVerification, loading } = useAuth();

  // Evento para actualizar el estado de los campos conforme se escribe en el input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields({ ...fields, [e.target.name]: e.target.value });

  // Evento para manejar el foco en un campo
  const handleFocus = (field: keyof Errors) =>
    setErrors((prev) => ({ ...prev, [field]: '' }));

  // Evento para enviar el formulario de registro
  const handleSubmitSignUp = async () => {
    setErrors({});

    try {
      await validationSchema.validate(fields, { abortEarly: false });
      await handleSignUp(fields);
      setIsCodeSent(true);
      alert('Verification code sent to your email.');
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors: Errors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path as keyof Errors] = err.message;
        });
        setErrors(validationErrors);
      } else {
        alert(error.message);
      }
    }
  };

  // Evento para enviar el formulario de verificación

  const handleSubmitVerification = async () => {
    if (!fields.verificationCode) return alert('Enter verification code.');
  
    try {
      await handleVerification(fields);  // Llamada al backend
      alert('Verification successful! Registration complete.');
      navigate('/Content');  // Redirigir después de la verificación exitosa
    } catch (error) {
      alert('Invalid verification code or email.');  // Si hay un error en la verificación
    }
  };
  


  return (
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }} autoComplete="off">
      {!isCodeSent && (
        <>
          <InputField
            label="Name"
            name="name"
            value={fields.name}
            onChange={handleChange}
            onFocus={() => handleFocus('name')}
            error={!!errors.name}
            helperText={errors.name}
            startIcon={<AccountCircle sx={{ color: 'black' }} />}
          />
          <InputField
            label="Email"
            name="email"
            value={fields.email}
            onChange={handleChange}
            onFocus={() => handleFocus('email')}
            error={!!errors.email}
            helperText={errors.email}
            startIcon={<EmailIcon sx={{ color: 'black' }} />}
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            value={fields.password}
            onChange={handleChange}
            onFocus={() => handleFocus('password')}
            error={!!errors.password}
            helperText={errors.password}
            startIcon={<LockIcon sx={{ color: 'black' }} />}
          />
          <Button onClick={handleSubmitSignUp} fullWidth variant="contained" disabled={loading} sx={{ background: 'black' }}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Divider>
              <Typography sx={{ color: 'text.secondary' }}>or</Typography>
            </Divider>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign up with Google')}
              startIcon={<GoogleLogo />}
              sx={{
                backgroundColor: 'black',
                border: '1px solid #ddd',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#f1f1f1',
                },
              }}
            >
              Sign up with Google
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <Link href="/sign-in" variant="body2">
                Sign in
              </Link>
            </Typography>
          </Box>
        </>
      )}
      {isCodeSent && (
        <>
          <InputField
            label="Verification Code"
            name="verificationCode"
            value={fields.verificationCode}
            onChange={handleChange}
            onFocus={() => handleFocus('verificationCode')}
            error={!!errors.verificationCode}
            helperText={errors.verificationCode}
            startIcon={<VerifiedUserIcon sx={{ color: 'black' }} />}
          />
          <Button onClick={handleSubmitVerification} fullWidth variant="contained" disabled={loading} sx={{ background: 'black' }}>
            {loading ? 'Verifying...' : 'Verify and Complete Registration'}
          </Button>
        </>
      )}
    </Box>
  );
};

export default SignUpForm;