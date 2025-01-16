import React from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { TextFieldProps } from '@mui/material/TextField';

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
  <FormControl>
    <TextField
      fullWidth
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      error={error}
      helperText={helperText}
      InputProps={{
        startAdornment: <InputAdornment position="start">{startIcon}</InputAdornment>,
      }}
      type={type} 
      autoComplete="off"
    />
  </FormControl>
);

export default InputField;
