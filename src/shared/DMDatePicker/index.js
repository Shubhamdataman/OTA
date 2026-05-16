import React from "react";
import dayjs from "dayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";

const DMDatePicker = ({ label, value, onChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value ? dayjs(value, "DD-MMM-YYYY") : null}
        onChange={(newValue) => {
          if (newValue) {
            onChange(newValue.format("DD-MMM-YYYY"));
          }
        }}
        format="DD-MMM-YYYY"
        slotProps={{
          textField: { size: "small", fullWidth: true },
        }}
      />
    </LocalizationProvider>
  );
};

export default DMDatePicker;
