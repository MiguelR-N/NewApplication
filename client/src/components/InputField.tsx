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
  error,
  helperText,
  startIcon,
  type = 'text',
}: InputFieldProps) => (
  <FormControl sx={{ marginBottom: 0.5 }}>
    <TextField
      fullWidth
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      error={error}
      InputProps={{
        startAdornment: <InputAdornment position="start">{startIcon}</InputAdornment>,
      }}
      type={type}
      autoComplete="off"
    />
    {/* Contenedor con espacio reservado para el mensaje de error */}
    <div
      style={{
        minHeight: '12px', // Altura mínima reducida
        fontSize: '12px',
        color: error ? 'red' : 'transparent',
        marginTop: '2px', // Margen superior mínimo
      }}
    >
      {helperText || ' '}
    </div>
  </FormControl>
);

export default InputField;
