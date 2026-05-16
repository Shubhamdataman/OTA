// store/selectors/hotelSearchSelectors.js
import { createSelector } from "@reduxjs/toolkit";
import dayjs from "dayjs";

// Basic selectors that return raw state (already memoized by Redux)
export const selectDestination = (state) => state.hotelSearch.destination;
export const selectCheckInRaw = (state) => state.hotelSearch.checkIn; // Raw string
export const selectCheckOutRaw = (state) => state.hotelSearch.checkOut; // Raw string
export const selectRooms = (state) => state.hotelSearch.rooms;
export const selectRoomSelection = (state) => state.hotelSearch.roomSelection;
export const selectSearchResults = (state) => state.hotelSearch.searchResults;
export const selectLoading = (state) => state.hotelSearch.loading;
export const selectSearchHistory = (state) => state.hotelSearch.searchHistory;

// FIXED: Memoized selectors that convert dates to Day.js objects
export const selectCheckIn = createSelector(
  [selectCheckInRaw],
  (checkIn) => checkIn ? dayjs(checkIn) : null
);

export const selectCheckOut = createSelector(
  [selectCheckOutRaw],
  (checkOut) => checkOut ? dayjs(checkOut) : null
);

// FIXED: Memoized complete search data
export const selectAllSearchData = createSelector(
  [(state) => state.hotelSearch],
  (hotelSearch) => ({
    ...hotelSearch,
    checkIn: hotelSearch.checkIn ? dayjs(hotelSearch.checkIn) : null,
    checkOut: hotelSearch.checkOut ? dayjs(hotelSearch.checkOut) : null,
  })
);

// Hotel details selectors
export const selectSelectedHotel = (state) => state.hotelSearch.selectedHotel;
export const selectHotelDetails = (state) => state.hotelSearch.hotelDetails;
export const selectRoomCategories = (state) => state.hotelSearch.roomCategories;
export const selectHotelLoading = (state) => state.hotelSearch.hotelLoading;
export const selectSelectedPlan = (state) => state.hotelSearch.selectedPlan;

// Checkout related selectors
export const selectCheckoutData = (state) => state.hotelSearch.checkoutData;
export const selectGuestDetails = (state) => state.hotelSearch.guestDetails;
export const selectGstDetails = (state) => state.hotelSearch.gstDetails;
export const selectSelectedCoupon = (state) => state.hotelSearch.selectedCoupon;
export const selectTotalAmt = (state) => state.hotelSearch.totalAmt;
export const selectPriceBreakup = (state) => state.hotelSearch.priceBreakup;

// Helper selector to get current booking category and plan
export const selectCurrentBooking = createSelector(
  [selectSelectedHotel, selectRoomCategories, selectSelectedPlan],
  (hotel, categories, selectedPlan) => {
    if (!hotel || !categories || !selectedPlan) return null;

    // Find the first category that has a selected plan
    const category = categories.find((cat) =>
      cat.plans?.some(
        (plan) =>
          plan.ratePlanCode === selectedPlan[cat.categoryCode]?.ratePlanCode
      )
    );

    const plan = category ? selectedPlan[category.categoryCode] : null;

    return {
      hotel,
      category,
      plan,
    };
  }
);

// ADDITIONAL USEFUL MEMOIZED SELECTORS:

// Calculate nights stay
export const selectNights = createSelector(
  [selectCheckIn, selectCheckOut],
  (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    return checkOut.diff(checkIn, 'day');
  }
);

// Formatted dates for display
export const selectFormattedCheckIn = createSelector(
  [selectCheckIn],
  (checkIn) => checkIn ? checkIn.format('DD MMM YYYY') : ''
);

export const selectFormattedCheckOut = createSelector(
  [selectCheckOut],
  (checkOut) => checkOut ? checkOut.format('DD MMM YYYY') : ''
);

// Search parameters for API calls
export const selectSearchParams = createSelector(
  [selectDestination, selectCheckInRaw, selectCheckOutRaw, selectRooms, selectRoomSelection],
  (destination, checkIn, checkOut, rooms, roomSelection) => ({
    destination,
    checkIn,
    checkOut,
    rooms,
    roomSelection
  })
);