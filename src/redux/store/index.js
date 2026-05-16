import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import authReducer from './authSlice';
import hotelSearchReducer from './hotelSearchSlice';
import checkOutReducer from './checkoutSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    hotelSearch: hotelSearchReducer,
    checkout: checkOutReducer,
  },
});

export default store;