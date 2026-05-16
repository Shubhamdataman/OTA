import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { 
  sendOtpAction, 
  verifyOtpLoginAction, 
  verifyOtpAction,
  logout,
  clearErrors 
} from '../redux/store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const sendOtp = useCallback((payload) => {
    return dispatch(sendOtpAction(payload));
  }, [dispatch]);

  const verifyOtpLogin = useCallback((payload) => {
    return dispatch(verifyOtpLoginAction(payload));
  }, [dispatch]);

  const verifyOtp = useCallback((payload) => {
    return dispatch(verifyOtpAction(payload));
  }, [dispatch]);

  const logoutUser = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const clearAuthErrors = useCallback(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  return {
    ...auth,
    sendOtp,
    verifyOtpLogin,
    verifyOtp,
    logout: logoutUser,
    clearErrors: clearAuthErrors,
  };
};