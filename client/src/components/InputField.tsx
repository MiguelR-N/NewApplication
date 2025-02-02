import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

type InputFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void; // Make onFocus optional
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
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
}: InputFieldProps) => {
  const [focused, setFocused] = useState(false); // Track focus state for blue effect

  return (
    <FormControl sx={{ marginBottom: 1, width: '100%' }}>
      <TextField
        fullWidth
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => {
          setFocused(true);
          if (onFocus) onFocus(); // Call parent's onFocus if provided
        }}
        onBlur={(e) => {
          setFocused(false);
          if (onBlur) onBlur(e); // Call parent's onBlur if provided
        }}
        error={error}
        InputProps={{
          startAdornment: <InputAdornment position="start">{startIcon}</InputAdornment>,
        }}
        type={type}
        autoComplete="off"
        sx={{
          marginBottom: '4px',
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: focused ? 'blue' : 'transparent', // Blue border on focus
            },
          },
        }} // Apply blue focus effect
      />
      <div
        style={{
          minHeight: '4px',
          fontSize: '9px',
          marginTop: '1px',
          color: error ? 'red' : '#6c757d',
          transition: 'opacity 0.2s ease-in-out',
          opacity: error || guideText ? 1 : 0,
        }}
      >
        {error ? helperText : guideText}
      </div>
    </FormControl>
  );
};

export default InputField;
