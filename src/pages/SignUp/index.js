import { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CssBaseline,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  InputAdornment,
  Link,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  Phone,
  Hotel,
  ArrowBack,
  CheckCircle,
  Email,
} from "@mui/icons-material";
import { ThemeProvider } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { createAppTheme } from "../../redux/theme";
import { useNavigate, Link as LinkRouter } from "react-router-dom";
import { sendOtp, signUp, verifyOtp } from "../../services/api";
import { validateNumber } from "../../shared/validateNumber";
import { validateEmail } from "../../shared/validateEmail";

const SignUp = () => {
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = createAppTheme(themeMode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [signupData, setSignupData] = useState({
    email: "",
    mobile: "",
    otp: "",
    firstName: "",
    lastName: "",
    loginMethod: "mobile",
  });

  const steps = [
    {
      label: "Mobile Number Verification",
      description: "Enter your mobile number to receive OTP",
    },
    {
      label: "Verify OTP",
      description: "Enter the verification code sent to your mobile",
    },
    {
      label: "Personal Information",
      description: "Complete your profile details",
    },
  ];

  const [errors, setErrors] = useState({});

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (field) => (event) => {
    const inputValue = event.target.value;
    console.log("field", field, " event ", inputValue);

    // Clear previous error for this field
    setErrors((prev) => ({ ...prev, [field]: "" }));

    switch (field) {
      case "mobile":
        if (validateNumber(inputValue, 10, 0)) {
          setSignupData((prev) => ({
            ...prev,
            [field]: inputValue,
          }));
        } else if (inputValue.length > 10) {
          setErrors((prev) => ({
            ...prev,
            mobile: "Mobile number cannot exceed 10 digits",
          }));
        }
        break;

      case "otp":
        if (validateNumber(inputValue, 4, 0)) {
          setSignupData((prev) => ({
            ...prev,
            [field]: inputValue,
          }));
        } else if (inputValue.length > 4) {
          setErrors((prev) => ({
            ...prev,
            otp: "OTP cannot exceed 4 digits",
          }));
        }
        break;

      case "firstName":
      case "lastName":
        const currentFirstName =
          field === "firstName" ? inputValue : signupData.firstName || "";
        const currentLastName =
          field === "lastName" ? inputValue : signupData.lastName || "";
        const combinedLength = (currentFirstName + " " + currentLastName)
          .length;

        if (combinedLength <= 100) {
          setSignupData((prev) => ({
            ...prev,
            [field]: inputValue,
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            [field]:
              "Combined first and last name cannot exceed 100 characters",
          }));
        }
        break;

      case "email":
        // Always update the field value to allow typing
        setSignupData((prev) => ({
          ...prev,
          [field]: inputValue,
        }));

        // Validate only if there's content
        if (inputValue && !validateEmail(inputValue)) {
          setErrors((prev) => ({
            ...prev,
            email: "Invalid email format",
          }));
        } else {
          setErrors((prev) => ({ ...prev, email: "" }));
        }
        break;

      default:
        setSignupData((prev) => ({
          ...prev,
          [field]: inputValue,
        }));
        break;
    }
  };

  const handleSendOTP = () => {
    setLoading(true);
    const payload = {
      data: signupData.mobile,
      nature: 0, // 0 for mobile
    };

    sendOtp(payload)
      .then((response) => {
        setLoading(false);
        if (response !== null && response.message) {
          activeStep === 0 && handleNext();
        } else {
          // Handle error case
          setErrors((prev) => ({
            ...prev,
            mobile: "Failed to send OTP. Please try again.",
          }));
        }
      })
      .catch((error) => {
        setLoading(false);
        setErrors((prev) => ({
          ...prev,
          mobile: "Failed to send OTP. Please try again.",
        }));
      });
  };

  const handleVerifyOTP = () => {
    setLoading(true);
    const payload = {
      data: signupData.mobile,
      otp: signupData.otp,
    };

    verifyOtp(payload)
      .then((response) => {
        setLoading(false);
        if (response !== null && response.message) {
          handleNext();
        } else {
          setErrors((prev) => ({
            ...prev,
            otp: "Invalid OTP. Please try again.",
          }));
          setSignupData((prev) => ({ ...prev, otp: "" }));
        }
      })
      .catch((error) => {
        setLoading(false);
        setErrors((prev) => ({
          ...prev,
          otp: "Verification failed. Please try again.",
        }));
        setSignupData((prev) => ({ ...prev, otp: "" }));
      });
  };

  const handleSignUp = (event) => {
    event.preventDefault();

    // Validate required fields
    if (!signupData.firstName || !signupData.lastName || !signupData.email) {
      setErrors((prev) => ({
        ...prev,
        firstName: !signupData.firstName ? "First name is required" : "",
        lastName: !signupData.lastName ? "Last name is required" : "",
        email: !signupData.email
          ? "Email is required"
          : !validateEmail(signupData.email)
          ? "Invalid email format"
          : "",
      }));
      return;
    }

    setLoading(true);
    const payload = {
      email: signupData.email,
      mobile: signupData.mobile,
      description: `${signupData.firstName} ${signupData.lastName}`,
    };

    signUp(payload)
      .then((response) => {
        setLoading(false);
        if (response !== null && response.message) {
          handleNext(); // Move to success step
        } else {
          setErrors((prev) => ({
            ...prev,
            form: "Sign up failed. Please try again.",
          }));
        }
      })
      .catch((error) => {
        setLoading(false);
        setErrors((prev) => ({
          ...prev,
          form: "Sign up failed. Please try again.",
        }));
      });
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Mobile Number"
              type="tel"
              value={signupData.mobile}
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
              sx={{ mb: 2 }}
              placeholder="Enter your 10-digit mobile number"
              inputProps={{ maxLength: 10 }}
            />
            {!loading && (
              <Button
                fullWidth
                variant="contained"
                onClick={handleSendOTP}
                disabled={loading || signupData.mobile.length !== 10}
                sx={{
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  borderRadius: 2,
                  background:
                    "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #E0556B 30%, #E57A3B 90%)",
                  },
                }}
              >
                Send OTP
              </Button>
            )}
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Enter Verification Code
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              We've sent a 4-digit code to your mobile number
            </Typography>

            <TextField
              fullWidth
              label="Enter OTP"
              value={signupData.otp}
              onChange={handleInputChange("otp")}
              error={!!errors.otp}
              helperText={errors.otp}
              sx={{ mb: 2 }}
              placeholder="Enter 4-digit code"
              inputProps={{ maxLength: 4 }}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{
                  flex: 1,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: "bold",
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleVerifyOTP}
                disabled={loading || signupData.otp.length !== 4}
                sx={{
                  flex: 1,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  borderRadius: 2,
                  background:
                    "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #E0556B 30%, #E57A3B 90%)",
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Verify OTP"}
              </Button>
            </Box>

            <Typography
              variant="body2"
              color="primary"
              sx={{ mt: 2, textAlign: "center", cursor: "pointer" }}
            >
              Didn't receive code?{" "}
              <Link component="button" variant="body2" onClick={handleSendOTP}>
                Resend OTP
              </Link>
            </Typography>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Complete Your Profile
            </Typography>

            {errors.form && (
              <Typography color="error" sx={{ mb: 2 }}>
                {errors.form}
              </Typography>
            )}

            <Grid container spacing={2}>
              <Grid sx={{xs:12 , sm:6}}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={signupData.firstName}
                  onChange={handleInputChange("firstName")}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  sx={{ mb: 2 }}
                  placeholder="Enter your first name"
                  required
                />
              </Grid>
              <Grid sx={{xs:12, sm:6}}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={signupData.lastName}
                  onChange={handleInputChange("lastName")}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  sx={{ mb: 2 }}
                  placeholder="Enter your last name"
                  required
                />
              </Grid>
              <Grid sx={{xs:12}}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={signupData.email}
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
                  placeholder="Enter your email address"
                  required
                />
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{
                  flex: 1,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: "bold",
                }}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  flex: 1,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  borderRadius: 2,
                  background:
                    "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #E0556B 30%, #E57A3B 90%)",
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Create Account"}
              </Button>
            </Box>
          </Box>
        );

      default:
        return "Unknown step";
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        component="main"
        maxWidth="md"
        sx={{
          px: { xs: 1, sm: 2 },
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          py: { xs: 2, sm: 4 },
        }}
      >
        <Box sx={{ width: "100%" }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Hotel
                sx={{
                  fontSize: { xs: 32, sm: 40 },
                  color: "primary.main",
                  mr: 2,
                }}
              />
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
                HotelBooking
              </Typography>
            </Box>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              Create your account in simple steps
            </Typography>
          </Box>

          {/* Home Navigation Button */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate("/")}
              sx={{
                borderRadius: 2,
                fontWeight: "bold",
              }}
            >
              Back to Home
            </Button>
          </Box>

          <Paper
            elevation={isMobile ? 1 : 3}
            sx={{
              padding: { xs: 3, sm: 4, md: 4 },
              width: "100%",
              borderRadius: { xs: 2, sm: 3 },
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)"
                  : "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
            }}
          >
            <Box component="form" onSubmit={handleSignUp}>
              {/* Stepper */}
              <Stepper
                activeStep={activeStep}
                orientation={isMobile ? "vertical" : "horizontal"}
                sx={{ mb: 4 }}
              >
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepLabel
                      StepIconProps={{
                        sx: {
                          "&.Mui-completed": {
                            color: "success.main",
                          },
                          "&.Mui-active": {
                            color: "primary.main",
                          },
                        },
                      }}
                    >
                      {!isMobile && (
                        <Typography variant="body2" fontWeight="bold">
                          {step.label}
                        </Typography>
                      )}
                    </StepLabel>
                    {isMobile && (
                      <StepContent>
                        <Typography variant="body2" color="text.secondary">
                          {step.description}
                        </Typography>
                        {getStepContent(index)}
                      </StepContent>
                    )}
                  </Step>
                ))}
              </Stepper>

              {/* Step Content for Desktop */}
              {!isMobile && activeStep < steps.length && (
                <Box sx={{ mt: 2 }}>{getStepContent(activeStep)}</Box>
              )}

              {/* Progress Indicator */}
              {loading && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 2,
                  }}
                >
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {activeStep === 0
                      ? "Sending OTP..."
                      : activeStep === 1
                      ? "Verifying OTP..."
                      : "Creating your account..."}
                  </Typography>
                </Box>
              )}

              {/* Success Message for Completion */}
              {activeStep === steps.length && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <CheckCircle
                    sx={{ fontSize: 60, color: "success.main", mb: 2 }}
                  />
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    Account Created Successfully!
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Welcome to HotelBooking! Your account has been created
                    successfully.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/login")}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: "bold",
                      borderRadius: 2,
                      background:
                        "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                    }}
                  >
                    Go to Login
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>

          {/* Login Link */}
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Link
                component={LinkRouter}
                to="/login"
                variant="body2"
                sx={{ fontWeight: "bold", textDecoration: "none" }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;
