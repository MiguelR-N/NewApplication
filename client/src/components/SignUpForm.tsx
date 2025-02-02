import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/useAuth';
import InputField from '../components/InputField';
import { validationSchema } from '../components/validationSchema';
import PersonIcon from '@mui/icons-material/Person';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Divider, Typography } from '@mui/material';
import SplitText from "./SplitText.tsx";

const MySwal = withReactContent(Swal);

type Errors = {
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
  verificationCode?: string;
};

const SignUpForm = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    verificationCode: '',
  });
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const { handleSignUp, handleVerification, loading } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleFocus = (field: keyof Errors) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmitSignUp = async () => {
    console.log('Submitting form with values:', fields);
    try {
      await validationSchema.validate(fields, { abortEarly: false });
      await handleSignUp(fields);
      setIsCodeSent(true);
    } catch (error: any) {
      console.error('Error during sign up:', error);
      MySwal.fire({
        icon: 'error',
        title: 'Sign Up Error',
        text: error.message || 'There was an error with your input.',
      });
    }
  };

  const handleSubmitVerification = async () => {
    if (!fields.verificationCode) {
      MySwal.fire({
        icon: 'error',
        title: 'Verification Error',
        text: 'Please enter the verification code sent to your email.',
      });
      return;
    }
    
    const result = await handleVerification({
      email: fields.email,
      verificationCode: fields.verificationCode,
    });
    
    if (result.success) {
      MySwal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Account verified successfully!',
      });
      navigate('/Home');
    } else {
      MySwal.fire({
        icon: 'error',
        title: 'Verification Error',
        text: result.message || 'Verification failed.',
      });
    }
  };

  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

  return (
    <Box
      component="form"
      sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: -1 }}
      autoComplete="off"
    >
      {/* Renderizamos el texto animado solo si el código de verificación aún no se ha enviado */}
      { !isCodeSent && (
        <SplitText
          text="Hello, User! Create a new account"
          className="text-8xl font-semibold text-center"
          delay={50}
          animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
          animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
          easing="easeOutCubic"
          threshold={0.2}
          rootMargin="-50px"
          onLetterAnimationComplete={handleAnimationComplete}
        />
      )}
      
      { !isCodeSent ? (
        <>
          <InputField
            label="Name"
            name="name"
            value={fields.name}
            onChange={handleChange}
            onFocus={() => handleFocus('name')}
            error={!!errors.name}
            helperText={errors.name}
            guideText="Enter your first name (e.g., John)"
            startIcon={<PersonIcon sx={{ color: 'black' }} />}
          />
          <InputField
            label="Last Name"
            name="lastname"
            value={fields.lastname}
            onChange={handleChange}
            onFocus={() => handleFocus('lastname')}
            error={!!errors.lastname}
            helperText={errors.lastname}
            guideText="Enter your last name (e.g., Doe)"
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
            guideText="At least 6 characters, uppercase, number and special char."
            startIcon={<VpnKeyIcon sx={{ color: 'black' }} />}
          />
          <Button
            onClick={handleSubmitSignUp}
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ background: 'black' }}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
          <Divider>
            <Typography sx={{ color: 'text.secondary' }}> or </Typography>
          </Divider>
          <Box sx={{ textAlign: 'center' }}>
            Already have an account?{' '}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                textDecoration: 'underline',
                color: 'black',
              }}
              onClick={() => navigate('/signin')}
            >
              Sign in
            </Box>
          </Box>
        </>
      ) : (
        <>
          <InputField
            label="Verification Code"
            name="verificationCode"
            value={fields.verificationCode}
            onChange={handleChange}
            onFocus={() => handleFocus('verificationCode')}
            error={!!errors.verificationCode}
            helperText={errors.verificationCode}
            guideText="Enter the verification code sent to your email."
            startIcon={<VerifiedUserIcon sx={{ color: 'black' }} />}
          />
          <Button
            onClick={handleSubmitVerification}
            fullWidth
            variant="contained"
            sx={{ background: 'black' }}
          >
            Verify Code
          </Button>
        </>
      )}
    </Box>
  );
};

export default SignUpForm;
