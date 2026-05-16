// redux/selectors/authSelectors.js
export const selectAuth = (state) => state.auth;

export const selectAuthLoading = (state) => state.auth.loading;
export const selectOtpSent = (state) => state.auth.otpSent;
export const selectAuthErrors = (state) => state.auth.errors;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.userName;
export const selectToken = (state) => state.auth.token;