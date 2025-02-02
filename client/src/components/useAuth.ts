import { useState } from 'react';

type User = {
  name: string;
  lastname: string;
  email: string;
  // Puedes agregar más propiedades si es necesario
};

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleSignUp = async (fields: { name: string; lastname: string; email: string; password: string }) => {
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
        const errorMessage = errorData.message || 'Something went wrong.';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Registro exitoso:', data.message);
      
      // Al registrar exitosamente, almacenamos la info del usuario.
      setUser({
        name: fields.name,
        lastname: fields.lastname,
        email: fields.email,
      });

      // Puedes retornar data si deseas usarla en el componente
      return data;
    } catch (error: any) {
      console.error('Error en el registro:', error.message);
      alert(`Error en el registro: ${error.message}`);
      throw error; // Lanza el error para que el componente sepa que falló
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (fields: { email: string; verificationCode: string; }) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: fields.email,
          verificationCode: fields.verificationCode,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to verify code.');
      }
  
      const data = await response.json();
  
      if (data.success) {
        console.log('Verificación exitosa:', data.message);
        return { success: true, message: data.message };
      } else {
        throw new Error('Invalid verification code or email.');
      }
    } catch (error: any) {
      console.error('Error en la verificación:', error.message);
      alert(`Error en la verificación: ${error.message}`);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignIn = async (fields: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fields),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid email or password.');
      }

      const data = await response.json();
      console.log('Login successful:', data.message);
      
      // Aquí podrías actualizar el estado del usuario si el login lo retorna
      // setUser({ name: data.name, lastname: data.lastname, email: fields.email });
      
    } catch (error: any) {
      console.error('Error en el inicio de sesión:', error.message);
      alert(`Error en el inicio de sesión: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return { handleSignUp, handleSignIn, handleVerification, loading, user };
};
