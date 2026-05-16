import { Chip } from '@mui/material';

const DmChip = ({label, variant, size, sx, onClick, disabled}) => {
  return (
    <Chip
    label={label}
    variant={variant}
    size={size}
    sx={sx}
    onClick={onClick}
    disabled={disabled}
  />
  )
}

export default DmChip