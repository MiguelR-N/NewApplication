import { useState } from 'react';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (fields: { name: string; email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fields),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register');
      }

      const data = await response.json();
      console.log(data.message); // Manejar la respuesta como necesites
    } catch (error) {
      console.error('Error en el registro:', error.message);
      alert(`Error en el registro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (fields: any) => {
    const response = await fetch('http://localhost:5000/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: fields.email,
        code: fields.verificationCode,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to verify code.');
    }

    const data = await response.json();
    if (data.message === 'User verified successfully.') {
      // Verificación exitosa
    } else {
      throw new Error('Invalid verification code or email.');
    }
  };

  return { handleSignUp, handleVerification, loading };
};
