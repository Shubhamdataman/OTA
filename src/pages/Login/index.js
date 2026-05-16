import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CssBaseline,
  useMediaQuery,
  Tabs,
  Tab,
  Divider,
  InputAdornment,
  Link,
  Fab,
} from "@mui/material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { Email, Phone, Hotel, Home } from "@mui/icons-material";
import { ThemeProvider } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { createAppTheme } from "../../redux/theme";

// Import auth slice actions and selectors
import {
  sendOtpAction,
  verifyOtpLoginAction,
  clearErrors,
  setOtpSent,
  clearOtpState,
} from "../../redux/store/authSlice";
import {
  selectAuthLoading,
  selectOtpSent,
  selectAuthErrors,
  selectIsAuthenticated,
} from "../../redux/store/selectors/authSelectors";

import { validateNumber } from "../../shared/validateNumber";
import { validateEmail } from "../../shared/validateEmail";

const Login = () => {
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = createAppTheme(themeMode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Select state from Redux auth slice
  const loading = useSelector(selectAuthLoading);
  const otpSent = useSelector(selectOtpSent);
  const errors = useSelector(selectAuthErrors);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [activeTab, setActiveTab] = useState(0);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loginData, setLoginData] = useState({
    email: "",
    mobile: "",
  });

  // Get return URL from navigation state or default to home
  const from = location.state?.returnUrl || "/";

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Clear errors when component unmounts or tab changes
  useEffect(() => {
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    dispatch(clearOtpState());
    setOtp(["", "", "", ""]);
    setLoginData({ email: "", mobile: "" });
  };

  const handleInputChange = (field) => (event) => {
    const inputValue = event.target.value;

    // Clear previous error for this field
    if (errors[field]) {
      dispatch(clearErrors());
    }

    if (field === "mobile") {
      if (validateNumber(inputValue, 10, 0)) {
        setLoginData((prev) => ({
          ...prev,
          [field]: inputValue,
        }));
      } else if (inputValue.length > 10) {
        // Set error in local state only, not in Redux
        setLoginData((prev) => ({
          ...prev,
          [field]: prev[field], // Don't update if invalid
        }));
      }
    } else if (field === "email") {
      setLoginData((prev) => ({
        ...prev,
        [field]: inputValue,
      }));
    } else {
      setLoginData((prev) => ({
        ...prev,
        [field]: inputValue,
      }));
    }
  };

  const handleOtpChange = (index) => (event) => {
    const value = event.target.value;

    // Only allow numbers and limit to 1 character
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleOtpKeyDown = (index) => (event) => {
    // Handle backspace
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSendOtp = async (event) => {
    event.preventDefault();

    // Validate input based on active tab
    let validationError = null;

    if (activeTab === 0) {
      // Email validation
      if (!loginData.email) {
        validationError = "Email is required";
      } else if (!validateEmail(loginData.email)) {
        validationError = "Invalid email format";
      }
    } else {
      // Mobile validation
      if (!loginData.mobile) {
        validationError = "Mobile number is required";
      } else if (loginData.mobile.length !== 10) {
        validationError = "Mobile number must be 10 digits";
      }
    }

    if (validationError) {
      // You can set this error in local state or handle differently
      console.error(validationError);
      return;
    }

    // Prepare payload for Redux action
    const payload = {
      data: activeTab === 0 ? loginData.email : loginData.mobile,
      nature: activeTab === 0 ? 1 : 0, // 1 for email, 0 for mobile
    };

    // Dispatch the Redux async thunk
    dispatch(sendOtpAction(payload));
  };

  const handleVerifyOtp = (event) => {
    event.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 4) {
      // Handle OTP validation error locally
      console.error("Please enter complete OTP");
      return;
    }

    // Prepare payload for Redux action
    const payload = {
      data: activeTab === 0 ? loginData.email : loginData.mobile,
      otp: otpValue,
      nature: activeTab === 0 ? 1 : 0, // 1 for email, 0 for mobile
    };

    // Dispatch the Redux async thunk for OTP verification
    dispatch(verifyOtpLoginAction(payload));
  };

  const handleResendOtp = () => {
    setOtp(["", "", "", ""]);
    
    // Resend OTP using the same data
    const payload = {
      data: activeTab === 0 ? loginData.email : loginData.mobile,
      nature: activeTab === 0 ? 1 : 0,
    };
    
    dispatch(sendOtpAction(payload));
  };

  const handleBackFromOtp = () => {
    dispatch(setOtpSent(false));
    setOtp(["", "", "", ""]);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Home Button - Floating Action Button */}
      <Fab
        color="primary"
        aria-label="home"
        component={RouterLink}
        to="/"
        sx={{
          position: "fixed",
          top: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          zIndex: 1000,
          background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
          "&:hover": {
            background: "linear-gradient(45deg, #E0556B 30%, #E57A3B 90%)",
            transform: "scale(1.1)",
          },
          transition: "all 0.3s ease",
        }}
      >
        <Home />
      </Fab>

      <Container
        component="main"
        maxWidth="sm"
        sx={{
          px: { xs: 1, sm: 2 },
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            marginTop: { xs: 2, sm: 0 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Header Section */}
          <Box sx={{ textAlign: "center", mb: 4, width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Typography
                component="h1"
                variant={isMobile ? "h4" : "h3"}
                sx={{
                  fontWeight: "bold",
                  background:
                    "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                dataman OTA
              </Typography>
            </Box>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              {otpSent
                ? "Enter verification code"
                : "Welcome back! Sign in to your account"}
            </Typography>
          </Box>

          <Paper
            elevation={isMobile ? 1 : 3}
            sx={{
              padding: { xs: 3, sm: 4, md: 5 },
              width: "100%",
              borderRadius: { xs: 2, sm: 3 },
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)"
                  : "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
              border:
                theme.palette.mode === "dark"
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px solid rgba(0,0,0,0.1)",
            }}
          >
            {/* Login Method Tabs - Only show when OTP not sent */}
            {!otpSent && (
              <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant="fullWidth"
                  sx={{
                    "& .MuiTab-root": {
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      fontWeight: "bold",
                      py: 2,
                      textTransform: "none",
                    },
                  }}
                >
                  <Tab
                    icon={<Email sx={{ fontSize: 20, mb: 0.5 }} />}
                    iconPosition="start"
                    label="Email Login"
                  />
                  <Tab
                    icon={<Phone sx={{ fontSize: 20, mb: 0.5 }} />}
                    iconPosition="start"
                    label="Mobile Login"
                  />
                </Tabs>
              </Box>
            )}

            <Box
              component="form"
              onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
            >
              {/* Display errors from Redux state */}
              {errors.form && (
                <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
                  {errors.form}
                </Typography>
              )}

              {/* Email/Mobile Input - Only show when OTP not sent */}
              {!otpSent && (
                <>
                  {/* Email Login */}
                  {activeTab === 0 && (
                    <Box>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={loginData.email}
                        onChange={handleInputChange("email")}
                        error={!!errors.email}
                        helperText={errors.email}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 2 }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                        sx={{ mb: 2 }}
                      >
                        We'll send you a One Time Password (OTP) to your email
                        address
                      </Typography>
                    </Box>
                  )}

                  {/* Mobile Login */}
                  {activeTab === 1 && (
                    <Box>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="mobile"
                        label="Mobile Number"
                        name="mobile"
                        autoComplete="tel"
                        value={loginData.mobile}
                        onChange={handleInputChange("mobile")}
                        error={!!errors.mobile}
                        helperText={errors.mobile}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 3 }}
                        inputProps={{ maxLength: 10 }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                        sx={{ mb: 2 }}
                      >
                        We'll send you a One Time Password (OTP) to your mobile
                        number
                      </Typography>
                    </Box>
                  )}
                </>
              )}

              {/* OTP Input - Show when OTP is sent */}
              {otpSent && (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold", textAlign: "center" }}
                  >
                    Enter Verification Code
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3, textAlign: "center" }}
                  >
                    We've sent a 4-digit code to your{" "}
                    {activeTab === 0 ? "email" : "mobile"}
                  </Typography>

                  {/* OTP Input Boxes */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 1,
                      mb: 3,
                    }}
                  >
                    {otp.map((digit, index) => (
                      <TextField
                        key={index}
                        id={`otp-${index}`}
                        value={digit}
                        onChange={handleOtpChange(index)}
                        onKeyDown={handleOtpKeyDown(index)}
                        inputProps={{
                          maxLength: 1,
                          style: { textAlign: "center", fontSize: "1.5rem" },
                        }}
                        sx={{
                          width: 60,
                          height: 60,
                          "& .MuiInputBase-input": {
                            textAlign: "center",
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                          },
                        }}
                        error={!!errors.otp}
                      />
                    ))}
                  </Box>

                  {errors.otp && (
                    <Typography
                      color="error"
                      sx={{ mb: 2, textAlign: "center" }}
                    >
                      {errors.otp}
                    </Typography>
                  )}

                  {/* Resend OTP Link */}
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ mt: 2, textAlign: "center", cursor: "pointer" }}
                  >
                    Didn't receive code?{" "}
                    <Link
                      component="button"
                      variant="body2"
                      onClick={handleResendOtp}
                      type="button"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Resend OTP"}
                    </Link>
                  </Typography>
                </Box>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading || (otpSent && otp.join("").length !== 4)}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  borderRadius: 2,
                  background:
                    "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #E0556B 30%, #E57A3B 90%)",
                    boxShadow: "0 4px 8px 2px rgba(255, 105, 135, .4)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {loading ? "Processing..." : otpSent ? "Verify OTP" : "Send OTP"}
              </Button>

              {/* Back Button when OTP is sent */}
              {otpSent && (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleBackFromOtp}
                  disabled={loading}
                  sx={{
                    mb: 2,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: "bold",
                  }}
                >
                  Back
                </Button>
              )}

              {/* Divider - Only show when not in OTP mode */}
              {!otpSent && (
                <Box sx={{ my: 3 }}>
                  <Divider />
                </Box>
              )}

              {/* Sign Up Link - Only show when not in OTP mode */}
              {!otpSent && (
                <Box sx={{ textAlign: "center", mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{" "}
                    <Link
                      component={RouterLink}
                      to="/signup"
                      variant="body2"
                      sx={{ fontWeight: "bold", textDecoration: "none" }}
                    >
                      Sign up
                    </Link>
                  </Typography>
                  <Box sx={{ mt: 1, textAlign: "center" }}>
                    <Typography variant="caption" color="text.secondary">
                      By continuing, you agree to our{" "}
                      <Link href="#" variant="caption">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="#" variant="caption">
                        Privacy Policy
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;