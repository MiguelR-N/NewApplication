import React from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

type InputFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; // Agregar onBlur como opcional
  guideText?: string;
  error: boolean;
  helperText: string | undefined;
  startIcon: React.ReactNode;
  type?: string;  
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  guideText,
  error,
  helperText,
  startIcon,
  type = 'text',
}: InputFieldProps) => (
  <FormControl sx={{ marginBottom: 2, width: '100%' }}>
    <TextField
      fullWidth
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      error={error}
      InputProps={{
        startAdornment: <InputAdornment position="start">{startIcon}</InputAdornment>,
      }}
      type={type}
      autoComplete="off"
    />
    {/* Contenedor con altura fija para mensajes */}
    <div
      style={{
        minHeight: '20px', // Altura fija para mensajes
        fontSize: '10px',
        marginTop: '4px',
        color: error ? 'red' : '#6c757d', // Rojo para error, gris para guía
        transition: 'opacity 0.2s ease-in-out', // Transición suave en visibilidad
        opacity: error || guideText ? 1 : 0, // Controla visibilidad
      }}
    >
      {error ? helperText : guideText}
    </div>
  </FormControl>
);



export default InputField;
