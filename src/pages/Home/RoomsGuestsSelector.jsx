import React, { useState } from 'react';
import {
  Box,
  Button,
  Popover,
  Typography,
  IconButton,
  Paper,
  Divider,
  MenuItem,
  Select,
  FormControl
} from '@mui/material';
import { Add, Remove, Close } from '@mui/icons-material';

const RoomsGuestsSelector = ({ value, onChange, theme }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Parse the value string (format: "1 Room, 2 Guests" or just room count)
  const parseValue = (val) => {
    if (typeof val === 'string') {
      if (val.includes(',')) {
        const roomMatch = val.match(/(\d+)\s*Room/);
        const guestMatch = val.match(/(\d+)\s*Guest/);
        return {
          rooms: roomMatch ? parseInt(roomMatch[1]) : 1,
          adults: guestMatch ? parseInt(guestMatch[1]) : 2,
          children: 0,
          childrenAges: []
        };
      }
      return {
        rooms: parseInt(val) || 1,
        adults: 2,
        children: 0,
        childrenAges: []
      };
    }
    return {
      rooms: 1,
      adults: 2,
      children: 0,
      childrenAges: []
    };
  };

  const [selection, setSelection] = useState(parseValue(value));

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRoomChange = (operation) => {
    setSelection(prev => {
      let newRooms = prev.rooms;
      let newAdults = prev.adults;
      
      if (operation === 'increment' && prev.rooms < 8) {
        newRooms = prev.rooms + 1;
        // When adding a room, maintain at least 1 adult per room
        newAdults = Math.max(prev.adults, newRooms);
      } else if (operation === 'decrement' && prev.rooms > 1) {
        newRooms = prev.rooms - 1;
        // When removing a room, adjust adults count if needed
        newAdults = Math.min(prev.adults, newRooms * 4);
      }

      const newSelection = {
        ...prev,
        rooms: newRooms,
        adults: newAdults
      };
      
      // Update parent component
      if (onChange) {
        onChange(newSelection);
      }
      
      return newSelection;
    });
  };

  const handleAdultsChange = (operation) => {
    setSelection(prev => {
      let newAdults = prev.adults;
      
      if (operation === 'increment' && prev.adults < prev.rooms * 4) {
        newAdults = prev.adults + 1;
      } else if (operation === 'decrement' && prev.adults > 1) {
        newAdults = prev.adults - 1;
        // Ensure at least 1 adult per room
        if (newAdults < prev.rooms) {
          newAdults = prev.rooms;
        }
      }

      const newSelection = {
        ...prev,
        adults: newAdults
      };
      
      if (onChange) {
        onChange(newSelection);
      }
      
      return newSelection;
    });
  };

  const handleChildrenChange = (operation) => {
    setSelection(prev => {
      let newChildren = prev.children;
      let newChildrenAges = [...prev.childrenAges];
      
      if (operation === 'increment' && prev.children < 4) {
        newChildren = prev.children + 1;
        newChildrenAges = [...prev.childrenAges, 0];
      } else if (operation === 'decrement' && prev.children > 0) {
        newChildren = prev.children - 1;
        newChildrenAges = prev.childrenAges.slice(0, -1);
      }

      const newSelection = {
        ...prev,
        children: newChildren,
        childrenAges: newChildrenAges
      };
      
      if (onChange) {
        onChange(newSelection);
      }
      
      return newSelection;
    });
  };

  const handleChildAgeChange = (index, age) => {
    setSelection(prev => {
      const newChildrenAges = [...prev.childrenAges];
      newChildrenAges[index] = parseInt(age);
      
      const newSelection = {
        ...prev,
        childrenAges: newChildrenAges
      };
      
      if (onChange) {
        onChange(newSelection);
      }
      
      return newSelection;
    });
  };

  const open = Boolean(anchorEl);
  const id = open ? 'rooms-guests-popover' : undefined;

  const getDisplayText = () => {
    const guestCount = selection.adults + selection.children;
    if (guestCount === 0) {
      return `${selection.rooms} Room${selection.rooms > 1 ? 's' : ''}`;
    }
    return `${selection.rooms} Room${selection.rooms > 1 ? 's' : ''}, ${guestCount} Guest${guestCount > 1 ? 's' : ''}`;
  };

  const getApiValue = () => {
    // Return just the room count for API compatibility
    return selection.rooms.toString();
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleClick}
        fullWidth
        sx={{
          backgroundColor: theme.palette.mode === "dark" ? "grey.800" : "#f8f9fa",
          borderRadius: 2,
          fontWeight: "bold",
          color: "text.primary",
          borderColor: theme.palette.mode === "dark" ? "grey.600" : "grey.300",
          textTransform: 'none',
          justifyContent: 'space-between',
          padding: '8px 16px',
          height: '40px',
          '&:hover': {
            borderColor: theme.palette.mode === "dark" ? "primary.light" : "primary.main",
            backgroundColor: theme.palette.mode === "dark" ? "grey.800" : "#f8f9fa",
          }
        }}
      >
        <Typography variant="body2" fontWeight="bold">
          {getDisplayText()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ▼
        </Typography>
      </Button>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          '& .MuiPopover-paper': {
            borderRadius: 2,
            minWidth: 320,
            maxWidth: 400,
            boxShadow: 3
          }
        }}
      >
        <Paper sx={{ p: 2 }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold">
              Rooms & Guests
            </Typography>
            <IconButton size="small" onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>

          {/* Rooms Selection */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">Rooms</Typography>
              <Typography variant="caption" color="text.secondary">
                Maximum 8 rooms
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton 
                size="small" 
                onClick={() => handleRoomChange('decrement')}
                disabled={selection.rooms <= 1}
                sx={{ 
                  border: 1, 
                  borderColor: 'grey.300',
                  borderRadius: 1
                }}
              >
                <Remove fontSize="small" />
              </IconButton>
              <Typography sx={{ minWidth: 30, textAlign: 'center', fontWeight: 'bold' }}>
                {selection.rooms}
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => handleRoomChange('increment')}
                disabled={selection.rooms >= 8}
                sx={{ 
                  border: 1, 
                  borderColor: 'grey.300',
                  borderRadius: 1
                }}
              >
                <Add fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Adults Selection */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">Adults</Typography>
              <Typography variant="caption" color="text.secondary">
                12+ years
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton 
                size="small" 
                onClick={() => handleAdultsChange('decrement')}
                disabled={selection.adults <= selection.rooms}
                sx={{ 
                  border: 1, 
                  borderColor: 'grey.300',
                  borderRadius: 1
                }}
              >
                <Remove fontSize="small" />
              </IconButton>
              <Typography sx={{ minWidth: 30, textAlign: 'center', fontWeight: 'bold' }}>
                {selection.adults}
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => handleAdultsChange('increment')}
                disabled={selection.adults >= selection.rooms * 4}
                sx={{ 
                  border: 1, 
                  borderColor: 'grey.300',
                  borderRadius: 1
                }}
              >
                <Add fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Children Selection */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">Children</Typography>
              <Typography variant="caption" color="text.secondary">
                0-17 years
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton 
                size="small" 
                onClick={() => handleChildrenChange('decrement')}
                disabled={selection.children <= 0}
                sx={{ 
                  border: 1, 
                  borderColor: 'grey.300',
                  borderRadius: 1
                }}
              >
                <Remove fontSize="small" />
              </IconButton>
              <Typography sx={{ minWidth: 30, textAlign: 'center', fontWeight: 'bold' }}>
                {selection.children}
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => handleChildrenChange('increment')}
                disabled={selection.children >= 4}
                sx={{ 
                  border: 1, 
                  borderColor: 'grey.300',
                  borderRadius: 1
                }}
              >
                <Add fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Children Age Selection */}
          {selection.children > 0 && (
            <Box mb={2}>
              <Typography variant="body2" fontWeight="bold" mb={1}>
                Children Ages
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                {selection.childrenAges.map((age, index) => (
                  <FormControl key={index} size="small" fullWidth>
                    <Select
                      value={age}
                      onChange={(e) => handleChildAgeChange(index, e.target.value)}
                      displayEmpty
                      sx={{ borderRadius: 1 }}
                    >
                      <MenuItem value={0}>Select Age</MenuItem>
                      {Array.from({ length: 18 }, (_, i) => (
                        <MenuItem key={i} value={i}>
                          {i} years
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ))}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Please provide age for best options and prices
              </Typography>
            </Box>
          )}

          {/* Total Guests Info */}
          <Box 
            sx={{ 
              p: 2, 
              backgroundColor: 'grey.50', 
              borderRadius: 1,
              border: 1,
              borderColor: 'grey.200'
            }}
          >
            <Typography variant="body2" fontWeight="bold">
              Total Guests: {selection.adults + selection.children}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {selection.rooms} Room{selection.rooms > 1 ? 's' : ''} • {selection.adults} Adult{selection.adults > 1 ? 's' : ''}
              {selection.children > 0 ? ` • ${selection.children} Child${selection.children > 1 ? 'ren' : ''}` : ''}
            </Typography>
          </Box>
        </Paper>
      </Popover>
    </>
  );
};

export default RoomsGuestsSelector;