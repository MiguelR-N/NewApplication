import React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SignUpForm from './components/SignUpForm';
import './index.css';

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: '100vh',
  minHeight: '100%',
  padding: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
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

export default function App(): React.ReactElement {
  return (
    <SignUpContainer direction="column" justifyContent="center">
      <StyledCard>
        <Typography
          component="h1"
          variant="h5" 
          sx={{ width: '100%', mb: 1 }} 
        >
          Sign up
        </Typography>
        <SignUpForm />
      </StyledCard>
    </SignUpContainer>
  );
}
