import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  Divider,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Backdrop,
  CircularProgress,
  Fade,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  LocationOn,
  ArrowBack,
  Celebration,
  LocalOffer,
  EmojiEvents,
  Hotel as HotelIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Import Redux actions and selectors
import {
  setGuestDetails,
  setGstDetails,
  setSelectedCoupon,
} from "../../redux/store/hotelSearchSlice";
import {
  selectSelectedHotel,
  selectAllSearchData,
  selectSelectedPlan,
  selectRoomCategories,
  selectGuestDetails,
  selectGstDetails,
  selectSelectedCoupon,
  selectCurrentBooking,
  selectTotalAmt,
  selectPriceBreakup,
} from "../../redux/store/selectors/hotelSearchSelectors";
import {
  selectIsAuthenticated,
  selectUser,
} from "../../redux/store/selectors/authSelectors";
import {
  bookHotelAction,
  setBookingSuccess,
} from "../../redux/store/checkoutSlice";
import {
  convertDateToUnixTimestamp,
  getUnixTimestamp,
} from "../../shared/dateUtils";
import {
  selectBookingResponse,
  selectBookingSuccess,
  selectCheckoutError,
  selectCheckoutLoading,
  selectOrderId,
} from "../../redux/store/selectors/checkoutSelectors";
import showToast from "../../shared/toastConfig";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Select state from Redux
  const hotel = useSelector(selectSelectedHotel);
  const searchData = useSelector(selectAllSearchData);
  const selectedPlan = useSelector(selectSelectedPlan);
  const roomCategories = useSelector(selectRoomCategories);
  const guestDetails = useSelector(selectGuestDetails);
  const gstDetails = useSelector(selectGstDetails);
  const selectedCoupon = useSelector(selectSelectedCoupon);
  const user = useSelector(selectUser);
  const loading = useSelector(selectCheckoutLoading);

  const isLoggedIn = useSelector(selectIsAuthenticated);

  // Get current booking using helper selector
  const currentBooking = useSelector(selectCurrentBooking);

  const totalAmt = useSelector(selectTotalAmt);
  const priceBreakup = useSelector(selectPriceBreakup);
  const error = useSelector(selectCheckoutError);
  const bookingSuccess = useSelector(selectBookingSuccess);
  const orderId = useSelector(selectOrderId);

  const [formErrors, setFormErrors] = useState({});

  const [payAtHotel, setPayAtHotel] = useState(false);

  // Calculate current category and plan from Redux state
  const getCurrentCategoryAndPlan = () => {
    if (!roomCategories || !selectedPlan) return { category: null, plan: null };
    // console.log('Room Categories:', roomCategories);
    // console.log('Selected Plan:', selectedPlan);
    // Find the first category that has a selected plan
    const category = roomCategories.find(
      (cat) => selectedPlan[cat.categoryCode]
    );

    const plan = category ? selectedPlan[category.categoryCode] : null;

    return { category, plan };
  };

  const { category, plan } = getCurrentCategoryAndPlan();

  // useEffect(() => {
  //   console.log('Current Booking Data:', currentBooking);
  // }, [currentBooking]);

  // Calculate prices
  const calculateNights = () => {
    if (!searchData?.checkIn || !searchData?.checkOut) return 1;
    return searchData.checkOut.diff(searchData.checkIn, "day") || 1;
  };

  const nights = calculateNights();

  // Redirect if no hotel data
  useEffect(() => {
    if (!hotel) {
      navigate("/");
      return;
    }
  }, [hotel, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleGuestDetailsChange = (field, value) => {
    dispatch(setGuestDetails({ ...guestDetails, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePayAtHotelChange = (event) => {
    setPayAtHotel(event.target.checked);
  };

  const validateForm = () => {
    const errors = {};

    if (!guestDetails.firstName.trim())
      errors.firstName = "First name is required";
    if (!guestDetails.lastName.trim())
      errors.lastName = "Last name is required";
    if (!guestDetails.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(guestDetails.email)) {
      errors.email = "Email is invalid";
    }
    if (!guestDetails.mobile.trim()) {
      errors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(guestDetails.mobile)) {
      errors.mobile = "Mobile number must be 10 digits";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayNow = async () => {
    if (!validateForm()) {
      return;
    }
    const payload = {
      hotelName: currentBooking?.hotel?.HotelName,
      ratePlanName: currentBooking?.plan?.planName,
      ratePlanCode: currentBooking?.plan?.ratePlanCode,
      inclusions: currentBooking?.plan?.roomPlanDesc,
      amount: priceBreakup.baseAmt * nights,
      taxAmount: priceBreakup.gstAmt * nights,
      totalAmt: totalAmt,
      TaxPayableAtHotel: "false",
      customerName: `${guestDetails.firstName} ${guestDetails.lastName}`,
      noOfRooms: "1",
      noOfNights: nights.toString(),
      roomTypeName: currentBooking?.category?.categoryName,
      roomTypeCode: currentBooking?.category?.categoryManualCode, //categoryManualCode
      checkInDate: convertDateToUnixTimestamp(
        searchData.checkIn.format("YYYY MM DD")
      ).toString(),
      checkOutDate: convertDateToUnixTimestamp(
        searchData.checkOut.format("YYYY MM DD")
      ).toString(),
      payAtHotelFlag: payAtHotel,
      bookingTime: getUnixTimestamp().toString(),
      hotelManualCode: currentBooking?.hotel?.hotelManualCode, //hotelManualCode
      bookingMode: payAtHotel ? "Ofline" : "Online",
      propertyCode: (currentBooking?.hotel?.hotelCode).toString(),
      v_Date: getUnixTimestamp().toString(),
      email: guestDetails.email,
      mobile: guestDetails.mobile,
      preparedBy: user,
    };

    if (isLoggedIn) {
      const response = await dispatch(bookHotelAction(payload));
      console.log("resppp", response);
      console.log("handlePayNow", orderId);
      if (response?.payload?.status === "success") {
        if (payAtHotel) {
          showToast("success", "Booking successful!");
          navigate("/");
        } else {
          navigate("/payment", {
            state: {
              bookingPayload: payload,
              orderId: response.payload?.data?.orderId,
            },
          });
        }
        dispatch(setBookingSuccess(false)); // Trigger success overlay
      } else {
        showToast("error", "Booking failed. Please try again.");
      }
    } else {
      navigate("/login", {
        state: {
          returnUrl: "/checkout",
          bookingData: {
            hotel,
            category,
            plan,
            searchData,
            guestDetails,
            totalAmt,
            selectedCoupon,
          },
        },
      });
    }
  };

  const isPayNowDisabled =
    !guestDetails.firstName ||
    !guestDetails.lastName ||
    !guestDetails.email ||
    !guestDetails.mobile;

  return (
    <>
      {/* Attractive Loading Backdrop */}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        }}
        open={loading}
      >
        <Fade in={loading} timeout={500}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
            }}
          >
            {/* Animated Circular Progress with color */}
            <CircularProgress
              size={80}
              thickness={4}
              sx={{
                color: "#ff6b00",
                animation: "pulse 1.5s ease-in-out infinite alternate",
                "@keyframes pulse": {
                  "0%": {
                    transform: "scale(1)",
                    opacity: 1,
                  },
                  "100%": {
                    transform: "scale(1.1)",
                    opacity: 0.8,
                  },
                },
              }}
            />

            {/* Loading Text */}
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h5"
                sx={{
                  color: "#ff6b00",
                  fontWeight: "bold",
                  mb: 1,
                  background: "linear-gradient(45deg, #ff6b00, #ff8f00)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Processing Your Booking
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#ffffff",
                  opacity: 0.9,
                }}
              >
                Please wait while we confirm your reservation...
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Backdrop>

      {/* Success State Overlay */}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          // backgroundColor: "rgba(0, 150, 0, 0.9)",
        }}
        open={bookingSuccess}
      >
        <Fade in={bookingSuccess} timeout={500}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              textAlign: "center",
            }}
          >
            {/* Success Icon */}
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                backgroundColor: "#4caf50",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "successPulse 1.5s ease-in-out infinite",
                "@keyframes successPulse": {
                  "0%": {
                    transform: "scale(1)",
                    boxShadow: "0 0 0 0 rgba(76, 175, 80, 0.7)",
                  },
                  "70%": {
                    transform: "scale(1.05)",
                    boxShadow: "0 0 0 20px rgba(76, 175, 80, 0)",
                  },
                  "100%": {
                    transform: "scale(1)",
                    boxShadow: "0 0 0 0 rgba(76, 175, 80, 0)",
                  },
                },
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                ✓
              </Typography>
            </Box>

            {/* Success Message */}
            <Box>
              <Typography
                variant="h4"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  mb: 2,
                }}
              >
                Booking Confirmed!
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  opacity: 0.9,
                  mb: 1,
                }}
              >
                Your hotel reservation has been successfully completed.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "white",
                  opacity: 0.8,
                }}
              >
                Redirecting to home page...
              </Typography>
            </Box>

            {/* Loading indicator for redirect */}
            <CircularProgress
              size={30}
              sx={{
                color: "white",
              }}
            />
          </Box>
        </Fade>
      </Backdrop>

      {/* Error Alert */}
      {/* {error && (
                        <Alert 
                          severity="error" 
                          sx={{ 
                            mb: 2,
                            animation: 'slideDown 0.3s ease-out',
                            '@keyframes slideDown': {
                              '0%': {
                                transform: 'translateY(-20px)',
                                opacity: 0,
                              },
                              '100%': {
                                transform: 'translateY(0)',
                                opacity: 1,
                              },
                            },
                          }}
                        >
                          {error}
                        </Alert>
                      )} */}
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ mb: 1, color: "primary.main", textTransform: "none" }}
        >
          Back
        </Button>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold", color: "#1a237e" }}
        >
          Review your Booking
        </Typography>
      </Box>

      <Grid>
        {/* Left Column - Booking Details & Guest Info (60%) */}
        <Grid sx={{ xs: 12, md: 7, lg: 7 }}>
          {/* Hotel & Booking Summary */}
          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 2,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "center", sm: "flex-start" },
                gap: 3,
                mb: 3,
              }}
            >
              {/* Hotel Image */}
              <Box
                sx={{
                  width: { xs: "100%", sm: 140 },
                  height: { xs: 180, sm: 120 },
                  borderRadius: 3,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <img
                  src={
                    hotel?.imageUrl
                      ? `http://192.168.6.7:8081${hotel.imageUrl}`
                      : "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
                  }
                  alt={hotel?.HotelName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>

              {/* Text Section */}
              <Box sx={{ width: "100%", flex: 1 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "1.1rem", sm: "1.25rem" },
                  }}
                >
                  {hotel?.HotelName}
                </Typography>

                <Chip
                  label="Couple Friendly"
                  color="success"
                  size="small"
                  sx={{
                    mb: 1,
                    fontWeight: "bold",
                    fontSize: "0.75rem",
                    px: 1,
                    borderRadius: 1,
                  }}
                />

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <LocationOn
                    sx={{ color: "text.secondary", mr: 1, fontSize: 20 }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.85rem", sm: "0.9rem" } }}
                  >
                    {hotel?.propertyAddress ||
                      "Madi+Marve Road, Aksa Beach, Malad (West), Mumbai, India"}
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  {/* CHECK-IN */}
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      CHECK IN
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        fontSize: { xs: "1rem", sm: "1.1rem" },
                      }}
                    >
                      {searchData?.checkIn &&
                        searchData.checkIn.format("DD MMM YYYY")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      2 PM
                    </Typography>
                  </Grid>

                  {/* CHECK-OUT */}
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      CHECK OUT
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        fontSize: { xs: "1rem", sm: "1.1rem" },
                      }}
                    >
                      {searchData?.checkOut &&
                        searchData.checkOut.format("DD MMM YYYY")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      11 AM
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>

            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                color: "#1a237e",
                fontSize: { xs: "0.9rem", sm: "1rem" },
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              {nights} Nights | {searchData?.roomSelection?.adults || 2} Adults
              | {searchData?.rooms || 1} Room
            </Typography>
          </Paper>

          {/* Room Details with Image */}
          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 2,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 3,
              }}
            >
              {/* Room Image */}
              <Box
                sx={{
                  width: { xs: "100%", sm: 140 },
                  height: { xs: 180, sm: 120 },
                  borderRadius: 3,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <img
                  src={
                    category?.imageUrl
                      ? `http://192.168.6.7:8081${category.imageUrl}`
                      : "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
                  }
                  alt={category?.categoryName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>

              {/* Room Info */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "1.05rem", sm: "1.25rem" },
                  }}
                >
                  {searchData?.rooms} × {category?.categoryName}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }}
                >
                  {searchData?.roomSelection?.adults} Adults
                </Typography>

                {/* Plan Details */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      color: "#d32f2f",
                      mb: 1,
                      fontSize: { xs: "0.95rem", sm: "1rem" },
                    }}
                  >
                    {plan?.planName}
                  </Typography>

                  <List
                    dense
                    sx={{
                      py: 0,
                      pl: 0.5,
                    }}
                  >
                    {[
                      "10% off on session of Spa",
                      "10% off on food & beverage services",
                      "Breakfast included",
                    ].map((item, index) => (
                      <ListItem key={index} sx={{ px: 0, py: 0.4 }}>
                        <ListItemIcon sx={{ minWidth: 20 }}>
                          <Typography
                            color="primary"
                            sx={{
                              fontSize: "1.1rem",
                              fontWeight: "bold",
                              lineHeight: 1,
                            }}
                          >
                            •
                          </Typography>
                        </ListItemIcon>
                        <ListItemText
                          primary={item}
                          primaryTypographyProps={{
                            fontSize: { xs: "0.85rem", sm: "0.95rem" },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Traveller Details */}
          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 2,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: "#1a237e",
                mb: 3,
                fontSize: { xs: "1rem", sm: "1.25rem" },
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              Guest Details
            </Typography>

            <Grid container spacing={2}>
              {/* First Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="First Name *"
                  value={guestDetails.firstName}
                  onChange={(e) =>
                    handleGuestDetailsChange("firstName", e.target.value)
                  }
                  error={!!formErrors.firstName}
                  helperText={formErrors.firstName}
                />
              </Grid>

              {/* Last Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Last Name *"
                  value={guestDetails.lastName}
                  onChange={(e) =>
                    handleGuestDetailsChange("lastName", e.target.value)
                  }
                  error={!!formErrors.lastName}
                  helperText={formErrors.lastName}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Email ID *"
                  value={guestDetails.email}
                  onChange={(e) =>
                    handleGuestDetailsChange("email", e.target.value)
                  }
                  error={!!formErrors.email}
                  helperText={
                    formErrors.email ||
                    "Booking voucher will be sent to this email ID"
                  }
                />
              </Grid>

              {/* Mobile */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Mobile Number *"
                  value={guestDetails.mobile}
                  onChange={(e) =>
                    handleGuestDetailsChange("mobile", e.target.value)
                  }
                  error={!!formErrors.mobile}
                  helperText={formErrors.mobile}
                  InputProps={{
                    startAdornment: (
                      <Box
                        sx={{
                          mr: 1,
                          color: "text.secondary",
                          fontWeight: "bold",
                        }}
                      >
                        +91
                      </Box>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Right Column - Price & Offers (40%) */}
        <Grid sx={{ xs: 12, md: 5, lg: 4 }}>
          {/* Price Summary */}
          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 2,
              borderRadius: 3,
              position: "sticky",
              top: 20,
              boxShadow: "0px 4px 18px rgba(0,0,0,0.1)",
              border: "1px solid #eeeeee",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#1a237e",
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                }}
              >
                Price Summary
              </Typography>
            </Box>

            {/* Price Breakdown */}
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ border: "none", py: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Base Price
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({nights} night{nights > 1 ? "s" : ""} × ₹
                        {priceBreakup.baseAmt})
                      </Typography>
                    </TableCell>

                    <TableCell align="right" sx={{ border: "none", py: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ₹{priceBreakup.baseAmt * nights}
                      </Typography>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell sx={{ border: "none", py: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Taxes
                      </Typography>
                    </TableCell>

                    <TableCell align="right" sx={{ border: "none", py: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ₹{priceBreakup.gstAmt * nights}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Divider sx={{ my: 1.5 }} />

            {/* Total Amount */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Total Amount
              </Typography>

              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    color: "#d32f2f",
                    fontSize: { xs: "1.4rem", sm: "1.6rem" },
                  }}
                >
                  ₹{Number(totalAmt).toFixed(2)}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  incl. all taxes & fees
                </Typography>
              </Box>
            </Box>

            {/* Pay at Hotel */}
            <Box
              sx={{
                mt: 2,
                p: 2,
                backgroundColor: "#fafafa",
                borderRadius: 2,
                border: "1px solid #e0e0e0",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={payAtHotel}
                    onChange={handlePayAtHotelChange}
                    sx={{
                      color: "#ff6b00",
                      "&.Mui-checked": { color: "#ff6b00" },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        color: payAtHotel ? "#ff6b00" : "text.primary",
                      }}
                    >
                      Pay at Hotel
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Pay directly at hotel during check-in
                    </Typography>
                  </Box>
                }
                sx={{ width: "100%", m: 0 }}
              />

              {payAtHotel && (
                <Alert
                  severity="info"
                  sx={{
                    mt: 1,
                    backgroundColor: "#e3f2fd",
                    borderRadius: 2,
                    "& .MuiAlert-icon": { color: "#1976d2" },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", mb: 0.3 }}
                  >
                    Pay at Hotel Selected
                  </Typography>
                  <Typography variant="caption">
                    Your room will be reserved. Payment will be collected at the
                    hotel.
                  </Typography>
                </Alert>
              )}
            </Box>

            {/* Final Button */}
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handlePayNow}
              disabled={isPayNowDisabled}
              sx={{
                fontWeight: "bold",
                py: 1.5,
                mt: 2,
                backgroundColor: "#ff6b00",
                "&:hover": { backgroundColor: "#e65100" },
                "&:disabled": {
                  backgroundColor: "#cccccc",
                  color: "#666",
                },
                textTransform: "none",
                fontSize: "1rem",
                borderRadius: 2,
                boxShadow: "0px 4px 10px rgba(255,107,0,0.3)",
              }}
            >
              {isLoggedIn
                ? payAtHotel
                  ? "Book Now"
                  : "Pay Now"
                : payAtHotel
                ? "Continue to book"
                : "Continue to payment"}
            </Button>

            {isPayNowDisabled && (
              <Alert severity="info" sx={{ mt: 1, fontSize: "0.8rem" }}>
                Please fill all mandatory guest details to proceed
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Checkout;
