import React from 'react';
import { Autocomplete, Checkbox, TextField, Typography } from '@mui/material';
import DmAutocomplete from '../DmAutocomplete';

export default function MultiSelectAutocomplete({
  options,
  label,
  placeholder,
  selectedValues,
  setSelectedValues,
}) {
  const handleChange = (event, newValue) => {
    setSelectedValues(newValue.map((item) => item.id));
  };

  const selectedObjects = options.filter((item) =>
    selectedValues.includes(item.id)
  );

  return (
    <DmAutocomplete
      multiple
      disableCloseOnSelect
      options={options}
      value={selectedObjects}
      onChange={handleChange}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            checked={selected}
            sx={{
              marginRight: 2,
              color: 'text.primary',
              '& .MuiSvgIcon-root': {
                fontSize: 16,
              },
            }}
          />
          {option.label}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label || 'Select'}
          placeholder={placeholder || 'Select options'}
        />
      )}
      fullWidth
    />
  );
}
