import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignUpForm from './components/SignUpForm';
import SignInForm from './pages/SignInForm'; // Asegúrate de que existe
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import './index.css';
import Home from './pages/Home';
import UploadFiles from './pages/UploadFiles';

// Estilos del contenedor y la tarjeta
const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: '100vh',
  minHeight: '100%',
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(1),
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  maxWidth: '400px',
  padding: theme.spacing(3),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '350px',
  },
}));

// Página de registro
const SignUpPage = () => (
  <SignUpContainer direction="column">
    <StyledCard>
      <SignUpForm />
    </StyledCard>
  </SignUpContainer>
);

// Componente principal
export default function App(): React.ReactElement {
  return (
    <Routes>
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signin" element={<SignInForm />} />
      <Route path="/home" element={<Home />} />
      <Route path="/uploadfiles" element={<UploadFiles />} />
      <Route path="/" element={<SignUpPage />} />
    </Routes>
  );
}
