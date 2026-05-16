// store/slices/hotelSearchSlice.js
import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";

// Helper functions to serialize/deserialize dates
const serializeDate = (date) => date?.format("YYYY-MM-DD") || null;

// Calculate default dates as strings
const defaultCheckIn = dayjs().add(2, "day").format("YYYY-MM-DD");
const defaultCheckOut = dayjs().add(3, "day").format("YYYY-MM-DD");

const initialState = {
  destination: null,
  checkIn: defaultCheckIn, // Store as string
  checkOut: defaultCheckOut, // Store as string
  rooms: "1",
  roomSelection: {
    rooms: 1,
    adults: 2,
    children: 0,
    childrenAges: [],
  },
  searchResults: [],
  loading: false,
  searchHistory: [],
  selectedHotel: null,
  hotelDetails: null,
  roomCategories: [],
  hotelLoading: false,
  selectedPlan: {},
  totalAmt: 0,
  priceBreakup: {},
  checkoutData: null,
  guestDetails: {
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
  },
};

const hotelSearchSlice = createSlice({
  name: "hotelSearch",
  initialState,
  reducers: {
    // Search related actions
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    setCheckIn: (state, action) => {
      // Convert Day.js object to string before storing
      state.checkIn =
        typeof action.payload === "string"
          ? action.payload
          : serializeDate(action.payload);
    },
    setCheckOut: (state, action) => {
      state.checkOut =
        typeof action.payload === "string"
          ? action.payload
          : serializeDate(action.payload);
    },
    setRooms: (state, action) => {
      state.rooms = action.payload;
    },
    setRoomSelection: (state, action) => {
      state.roomSelection = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    updateSearchData: (state, action) => {
      const updatedData = { ...action.payload };

      // Handle date serialization in bulk updates
      if (updatedData.checkIn && typeof updatedData.checkIn !== "string") {
        updatedData.checkIn = serializeDate(updatedData.checkIn);
      }
      if (updatedData.checkOut && typeof updatedData.checkOut !== "string") {
        updatedData.checkOut = serializeDate(updatedData.checkOut);
      }

      return { ...state, ...updatedData };
    },
    resetSearch: (state) => {
      const newCheckIn = dayjs().add(2, "day").format("YYYY-MM-DD");
      const newCheckOut = dayjs().add(3, "day").format("YYYY-MM-DD");

      return {
        ...initialState,
        checkIn: newCheckIn,
        checkOut: newCheckOut,
      };
    },
    addToSearchHistory: (state, action) => {
      const newSearch = {
        ...action.payload,
        timestamp: new Date().toISOString(),
        id: Date.now(),
      };
      state.searchHistory = [newSearch, ...state.searchHistory.slice(0, 4)];
    },
    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },

    // Hotel details related actions
    setSelectedHotel: (state, action) => {
      state.selectedHotel = action.payload;
    },
    setHotelDetails: (state, action) => {
      state.hotelDetails = action.payload;
    },
    setRoomCategories: (state, action) => {
      state.roomCategories = action.payload;
    },
    setHotelLoading: (state, action) => {
      state.hotelLoading = action.payload;
    },
    setSelectedPlan: (state, action) => {
      state.selectedPlan = action.payload;
    },
    setTotalAmt: (state, action) => {
      state.totalAmt = action.payload;
    },
    setPriceBreakup: (state, action) => {
      state.priceBreakup = action.payload;
    },
    clearHotelDetails: (state) => {
      state.selectedHotel = null;
      state.hotelDetails = null;
      state.roomCategories = [];
      state.selectedPlan = {};
    },

    // Add checkout related reducers
    setCheckoutData: (state, action) => {
      state.checkoutData = action.payload;
    },
    setGuestDetails: (state, action) => {
      state.guestDetails = action.payload;
    },
    setSelectedCoupon: (state, action) => {
      state.selectedCoupon = action.payload;
    },
    clearCheckoutData: (state) => {
      state.checkoutData = null;
      state.guestDetails = initialState.guestDetails;
      state.gstDetails = initialState.gstDetails;
      state.selectedCoupon = null;
    },
  },
});

export const {
  setDestination,
  setCheckIn,
  setCheckOut,
  setRooms,
  setRoomSelection,
  setSearchResults,
  setLoading,
  updateSearchData,
  resetSearch,
  addToSearchHistory,
  clearSearchHistory,
  setSelectedHotel,
  setHotelDetails,
  setRoomCategories,
  setHotelLoading,
  // selected hotel plan related actions
  setSelectedPlan,
  setTotalAmt,
  clearHotelDetails,
  //checkout related actions will be added here
  setCheckoutData,
  setGuestDetails,
  setGstDetails,
  setSelectedCoupon,
  clearCheckoutData,
  setPriceBreakup,
} = hotelSearchSlice.actions;

export default hotelSearchSlice.reducer;
