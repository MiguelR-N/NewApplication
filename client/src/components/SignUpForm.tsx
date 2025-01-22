import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import InputField from './InputField';
import { validationSchema } from './validationSchema';
import * as Yup from 'yup';
import PersonIcon from '@mui/icons-material/Person';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GoogleLogo from '@mui/icons-material/Google';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  verificationCode?: string;
};

const SignUpForm = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    name: '',
    email: '',
    password: '',
    verificationCode: '',
  });

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const { handleSignUp, handleVerification, loading } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields({ ...fields, [e.target.name]: e.target.value });

  const handleFocus = (field: keyof Errors) =>
    setErrors((prev) => ({ ...prev, [field]: '' }));

  const handleSubmitSignUp = async () => {
    setErrors({});
    try {
      await validationSchema.validate(fields, { abortEarly: false });
      await handleSignUp(fields);

      // Mostrar alerta de éxito
      MySwal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text: 'A verification code has been sent to your email. Please verify to complete the registration.',
        confirmButtonColor: '#3085d6',
      });

      setIsCodeSent(true);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors: Errors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path as keyof Errors] = err.message;
        });
        setErrors(validationErrors);
      } else {
        console.error('Error en el registro:', error.message);
      }
    }
  };

  const handleSubmitVerification = async () => {
    if (!fields.verificationCode) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: 'Enter verification code.',
      }));
      return;
    }

    try {
      await handleVerification(fields);

      // Mostrar alerta de éxito
      MySwal.fire({
        icon: 'success',
        title: 'Verification Successful!',
        text: 'Your account has been verified. Welcome aboard!',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        navigate('/Content'); // Navegar después de cerrar la alerta
      });
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: 'Invalid verification code or email.',
      }));
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
            guideText="Enter your full name (e.g., John Doe)"
            startIcon={<PersonIcon sx={{ color: 'black' }} />}
          />
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
            guideText="At least 6 characters, including 1 uppercase, 1 number, and 1 special char."
            startIcon={<VpnKeyIcon sx={{ color: 'black' }} />}
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
              onClick={() => console.log('Sign up with Google')}
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
              <Link href="/SignInForm" variant="body2">
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
            guideText="Enter the 6-digit code sent to your email."
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
