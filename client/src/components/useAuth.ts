import { useState } from 'react';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // Función para manejar el registro del usuario
  const handleSignUp = async (fields: any) => {
    setLoading(true);
    try {
      // Realizar la solicitud a la API de registro
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fields), // Enviar los campos del formulario
      });

      // Verificar si la solicitud fue exitosa
      if (!response.ok) {
        throw new Error('Registration failed. Please try again.');
      }

      const data = await response.json();
      return data; // Aquí puedes manejar la respuesta si es necesario
    } catch (error) {
      setErrors({ message: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar la verificación del código
  const handleVerification = async (fields: any) => {
    setLoading(true);
    try {
      // Realizar la solicitud a la API de verificación
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fields), // Enviar el código de verificación
      });

      // Verificar si la solicitud fue exitosa
      if (!response.ok) {
        throw new Error('Verification failed. Please try again.');
      }

      const data = await response.json();
      return data; // Aquí puedes manejar la respuesta si es necesario
    } catch (error) {
      setErrors({ message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return { handleSignUp, handleVerification, loading, errors };
};
