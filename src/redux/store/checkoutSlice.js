import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { bookHotel } from "../../services/api";

// Async thunks for API calls
export const bookHotelAction = createAsyncThunk(
  'bookings/saveRecord',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await bookHotel(payload);
      if (response) {
        return response;
      }else{
         return rejectWithValue(response || 'Failed to book hotel');
      }
     
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to book hotel');
    }
  }
);

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    bookingResponse: null,
    loading: false,
    error: null,
    bookingSuccess: false,
    orderId: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setBookingSuccess: (state, action) => {
      state.bookingSuccess = action.payload;
    },
    clearBookingState: (state) => {
      state.bookingResponse = null;
      state.loading = false;
      state.error = null;
      state.bookingSuccess = false;
    },
    resetBookingSuccess: (state) => {
      state.bookingSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(bookHotelAction.pending, (state) => {
        state.loading = true; 
        state.error = null;
        state.bookingSuccess = false;
      })
      .addCase(bookHotelAction.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingResponse = action.payload;
        state.bookingSuccess = action.payload?.status === 'success' ? true : false;
        state.error = null;
        state.orderId = action.payload?.data?.orderId || null;
      })
      .addCase(bookHotelAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.bookingSuccess = false;
      });
  },
});

export const { setLoading, clearBookingState, resetBookingSuccess, setBookingSuccess } = checkoutSlice.actions;



export default checkoutSlice.reducer;