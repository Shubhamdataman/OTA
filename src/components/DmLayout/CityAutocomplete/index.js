import { useState, useRef, useCallback } from 'react';
import {
  TextField,
  Autocomplete,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import { useCityAutocomplete } from '../../../hooks/useCityAutocomplete';

const CityAutocomplete = ({ value, onChange, error, helperText, ...props }) => {
  const {
    options,
    loading,
    hasMore,
    handleSearch,
    loadMore
  } = useCityAutocomplete();

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const listboxRef = useRef(null);

  const handleInputChange = useCallback((event, newInputValue) => {
    setInputValue(newInputValue);
    handleSearch(newInputValue);
  }, [handleSearch]);

  const handleScroll = useCallback((event) => {
    const listboxNode = listboxRef.current;
    
    if (listboxNode) {
      const { scrollTop, scrollHeight, clientHeight } = listboxNode;
      // console.log("listboxNode", scrollTop, " scrollHeight:", scrollHeight, " clientHeight:", clientHeight);
      // console.log("hasmore", hasMore, " loading", loading)
      const scrollThreshold = 50; // pixels from bottom
      
      // Check if scrolled to bottom
      if (scrollTop + clientHeight >= scrollHeight - scrollThreshold && !loading && hasMore) {
        // console.log('Loading more cities...'); // Debug log
        loadMore();
      }
    }
  }, [loading, hasMore, loadMore]);

  return (
    <Autocomplete
      {...props}
      size='small'
      fullWidth
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={options}
      getOptionLabel={(option) => option.cityName || ''}
      value={value}
      onChange={onChange}
      loading={loading}
      filterOptions={(x) => x}
      slotProps={{
        listbox: {
          onScroll: handleScroll,
          ref: listboxRef,
          style: { 
            maxHeight: 200, 
            overflow: 'auto',
            position: 'relative'
          }
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          placeholder="Search city"
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        return (
          <Box 
            key={key}
            component="li" 
            {...otherProps}
            sx={{ 
              width: '100%',
              py: 1,
              borderBottom: '1px solid',
              borderColor: 'divider',
              '&:last-child': {
                borderBottom: 'none'
              }
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant="body1" fontWeight="medium" noWrap>
                {option.cityName}
              </Typography>
            </Box>
          </Box>
        );
      }}
      noOptionsText={
        loading ? "Loading..." : inputValue ? "No cities found" : "Start typing to search cities"
      }
      sx={{
        width: '100%',
        ...props.sx
      }}
    />
  );
};

export default CityAutocomplete;