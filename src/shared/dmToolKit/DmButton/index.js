import { Button } from '@mui/material';
import React from 'react';
import styles from '../../shared.module.css';
import { useThemeMode } from '../../../../../shared/src/lib/context/ThemeContext';

function DmButton({
  variant,
  fullWidth,
  sx = {},
  type,
  onClick,
  size,
  children,
  disabled,
}) {
  const { mode, toggleTheme } = useThemeMode();
  const buttonClasses = [
    mode === 'light' ? styles.dmClassButtonLight : styles.dmClassButtonDark,
    mode === 'light' && disabled ? styles.dmClassButtonLightDisabled : null,
    mode === 'dark' && disabled ? styles.dmClassButtonDarkDisabled : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Button
      className={buttonClasses}
      variant={variant}
      fullWidth={true}
      sx={{
        borderRadius: 2,
        minWidth: 0,
        ...sx,
      }}
      type={type}
      onClick={onClick}
      size={size}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}

export default DmButton;
