import React from 'react';
import { Card } from '@mui/material';
import styles from '../../shared.module.css';
import { useThemeMode } from '../../../../../shared/src/lib/context/ThemeContext';

function DmCard({ sx = {}, children }) {
  const { mode, toggleTheme } = useThemeMode();
  return (
    <Card
      sx={sx}
      className={
        mode === 'light' ? styles.dmClassCardLight : styles.dmClassCardDark
      }
    >
      {children}
    </Card>
  );
}

export default DmCard;
