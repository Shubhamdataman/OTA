import React from 'react';
import { TextField, FormControl, FormLabel, Box } from '@mui/material';
import styles from '../../shared.module.css';
import { useThemeMode } from '../../../../../shared/src/lib/context/ThemeContext';

const DmTextfield = ({
  name,
  label,
  variant = 'outlined',
  fullWidth = true,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  onKeyDown,
  disabled,
  required,
  inputProps,
  InputProps,
  type,
  InputLabelProps,
  onClick,
  inputRef,
  placeholder,
  multiline = false,
  rows,
  sx = {},
  showFormLabel = true,
  variantMode = 'contained',
}) => {
  const { mode } = useThemeMode();

  // Class mappings for light/dark mode
  const rootClass =
    mode === 'light' ? styles.dmTextfieldRootLight : styles.dmTextfieldRootDark;
  const disabledClass =
    mode === 'light'
      ? styles.dmTextfieldDisabledLight
      : styles.dmTextfieldDisabledDark;
  const labelClass =
    mode === 'light' ? styles.dmLabelLight : styles.dmLabelDark;
  const labelDisabledClass =
    mode === 'light' ? styles.dmLabelDisabledLight : styles.dmLabelDisabledDark;
  const inputClass =
    mode === 'light' ? styles.dmInputLight : styles.dmInputDark;
  const inputDisabledClass =
    mode === 'light' ? styles.dmInputDisabledLight : styles.dmInputDisabledDark;
  const outlineClass =
    mode === 'light' ? styles.dmOutlineLight : styles.dmOutlineDark;

  // Shared TextField element
  const containedTextField = (
    <TextField
      name={name}
      type={type}
      variant={variant}
      fullWidth={fullWidth}
      size="small"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      onKeyDown={onKeyDown}
      disabled={Boolean(disabled)}
      required={required}
      autoComplete="off"
      onClick={onClick}
      inputRef={inputRef}
      placeholder={placeholder}
      multiline={multiline}
      rows={rows}
      label={variantMode === 'contained' ? label : undefined}
      sx={{
        ...(!showFormLabel && variantMode === 'form' && { mt: 2 }),
        borderRadius: '8px',
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
        },
        ...sx,
      }}
      inputProps={{
        ...inputProps,
        className: `${inputClass} ${disabled ? inputDisabledClass : ''}`,
        style: {
          padding: '6px 8px',
          fontSize: '14px',
          fontWeight: 600,
          lineHeight: 1.2,
          borderRadius: '8px',
          ...inputProps?.style,
        },
      }}
      InputProps={{
        ...InputProps,
        classes: {
          root: rootClass,
          disabled: disabledClass,
          notchedOutline: outlineClass,
        },
        style: {
          minHeight: '36px',
          ...InputProps?.style,
        },
      }}
      InputLabelProps={{
        ...InputLabelProps,
        classes: {
          root: labelClass,
          disabled: labelDisabledClass,
        },
        style: {
          fontSize: '14px',
          ...InputLabelProps?.style,
        },
      }}
    />
  );

  // If 'contained' mode, return just the TextField
  if (variantMode === 'contained') {
    return containedTextField;
  }

  // Otherwise render FormControl + FormLabel + TextField
  return (
    <FormControl fullWidth={fullWidth} disabled={disabled} sx={{ ...sx }}>
      {showFormLabel && label && (
        <FormLabel
          sx={{
            fontSize: '14px',
            mb: 0.5,
            color: 'text.primary',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          {label}
          {required && (
            <Box
              component="span"
              sx={{
                color: disabled ? 'text.disabled' : 'error.main',
                ml: 0.5,
              }}
            >
              *
            </Box>
          )}
        </FormLabel>
      )}

      {containedTextField}
    </FormControl>
  );
};

export default DmTextfield;