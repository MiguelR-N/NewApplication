import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/useAuth';
import InputField from '../components/InputField';
import { validationSchema } from '../components/validationSchema';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const SignInForm = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { handleSignIn, loading } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleFocus = (field: keyof typeof errors) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmitSignIn = async () => {
    try {
      // Validación con Yup
      await validationSchema.validate(fields, { abortEarly: false });

      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });

      if (response.ok) {
        const result = await response.json();
        MySwal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: result.message,
          timer: 2000, // Se cierra después de 2 segundos
          showConfirmButton: false,
        });
        setTimeout(() => {
          navigate('/home'); // Redirigir a la página principal
        }, 2000);
      } else {
        const error = await response.json();
        MySwal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.message,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      MySwal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'There was an error with your input.',
      });
    }
  };

  return (
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }} autoComplete="off">
      <InputField
        label="Email"
        name="email"
        value={fields.email}
        onChange={handleChange}
        onFocus={() => handleFocus('email')}
        error={!!errors.email}
        helperText={errors.email}
        guideText="Use a valid email (e.g., example@gmail.com)"
        startIcon={<MailOutlineIcon sx={{ color: 'black' }} />}
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
        guideText="At least 6 characters, uppercase, number and special char."
        startIcon={<VpnKeyIcon sx={{ color: 'black' }} />}
      />

      <Button onClick={handleSubmitSignIn} fullWidth variant="contained" disabled={loading} sx={{ background: 'black' }}>
        {loading ? 'Logging In...' : 'Sign In'}
      </Button>

      <Button
        onClick={() => navigate('/signup')}
        fullWidth
        sx={{ textDecoration: 'underline', color: 'black', marginTop: 2 }}
      >
        Don't have an account? Sign Up
      </Button>
    </Box>
  );
};

export default SignInForm;
