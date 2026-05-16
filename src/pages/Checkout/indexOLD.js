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
import { bookHotelAction } from "../../redux/store/checkoutSlice";
import {
  convertDateToUnixTimestamp,
  getUnixTimestamp,
} from "../../shared/dateUtils";
import { selectCheckoutLoading } from "../../redux/store/selectors/checkoutSelectors";
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

  const noOfAdults = searchData?.roomSelection?.adults;
  // Local UI states
  const [showGST, setShowGST] = useState(false);
  const [expandedCoupon, setExpandedCoupon] = useState(false);
  const [showPriceBreakup, setShowPriceBreakup] = useState(false);
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

  // Coupon data
  const coupons = [
    {
      code: "MMTSMARTDEAL",
      discount: 2106,
      description: "Congratulations! Discount of ₹2106",
      applied: selectedCoupon === "MMTSMARTDEAL",
      icon: <Celebration sx={{ fontSize: 16, color: "#ff6b00" }} />,
    },
    {
      code: "MMTSMARTSAVL",
      discount: 2106,
      description: "Great Discounts for You, Get ₹2106 Off",
      applied: selectedCoupon === "MMTSMARTSAVL",
      icon: <LocalOffer sx={{ fontSize: 16, color: "#ff6b00" }} />,
    },
    {
      code: "AXISEMI",
      discount: 4491,
      description: "Axis Bank Credit Card EMI Offer - Get ₹4491 Off!",
      applied: selectedCoupon === "AXISEMI",
      icon: <EmojiEvents sx={{ fontSize: 16, color: "#ff6b00" }} />,
    },
  ];

  const bankOffers = [
    {
      code: "HDFCEMI",
      discount: 3041,
      description:
        "HDFC Bank Credit Card EMI Paymode Offer - Get ₹3041 Off And NoCostEMI",
    },
    {
      code: "IDBICC",
      discount: 3000,
      description: "IDBI Bank Credit Card Users - Get ₹3000 Off!",
    },
    {
      code: "KOTAKEMI",
      discount: 2854,
      description: "KOTAK Credit Card EMI Paymode Offer - Get ₹2654 Off!",
    },
  ];

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

  const handleGstDetailsChange = (field, value) => {
    dispatch(setGstDetails({ ...gstDetails, [field]: value }));
  };

  const handleCouponSelect = (couponCode) => {
    dispatch(setSelectedCoupon(couponCode));
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

  const handlePayNow = () => {
    if (!validateForm()) {
      return;
    }
    const payAtHotelFlag = guestDetails?.payAtHotelFlag || true;
    const payload = {
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
      payAtHotelFlag: payAtHotelFlag,
      bookingTime: getUnixTimestamp().toString(),
      hotelManualCode: currentBooking?.hotel?.hotelManualCode, //hotelManualCode
      bookingMode: payAtHotelFlag ? "Ofline" : "Online",
      propertyCode: (currentBooking?.hotel?.hotelCode).toString(),
      v_Date: getUnixTimestamp().toString(),
      email: guestDetails.email,
      mobile: guestDetails.mobile,
      preparedBy: user,
    };

    if (isLoggedIn) {
      const response = dispatch(bookHotelAction(payload));
      console.log("response", response);

      if (response?.status === "200") {
        showToast("success", "Booking successful!");
        navigate("/")
      }else{
        showToast("error", "Booking failed. Please try again.");
      }

      // navigate('/payment', {
      //   state: {
      //     hotel,
      //     category,
      //     plan,
      //     searchData,
      //     guestDetails,
      //     finalAmount,
      //     selectedCoupon
      //   }
      // });
    } else {
      // navigate('/login', {
      //   state: {
      //     returnUrl: '/cart',
      //     bookingData: {
      //       hotel,
      //       category,
      //       plan,
      //       searchData,
      //       guestDetails,
      //       finalAmount,
      //       selectedCoupon
      //     }
      //   }
      // });
    }
  };

  const isPayNowDisabled =
    !guestDetails.firstName ||
    !guestDetails.lastName ||
    !guestDetails.email ||
    !guestDetails.mobile;

  // Get applied coupon
  const appliedCoupon = coupons.find((coupon) => coupon.applied);

  return loading ? (
    <Typography variant="h6" sx={{ textAlign: "center", mt: 5 }}>
      Processing your booking...
    </Typography>
  ) : (
    <>
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

      <Grid container spacing={3}>
        {/* Left Column - Booking Details & Guest Info (60%) */}
        <Grid sx={{ xs: 12, md: 7, lg: 7 }}>
          {/* Hotel & Booking Summary */}
          <Paper sx={{ p: 3, mb: 2, borderRadius: 2 }}>
            <Box
              sx={{ display: "flex", alignItems: "flex-start", gap: 3, mb: 3 }}
            >
              <Box
                sx={{
                  width: 120,
                  height: 100,
                  borderRadius: 2,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <img
                  src={
                    hotel?.imageUrl
                      ? `http://192.168.6.7:8081${hotel.imageUrl}`
                      : "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=120&h=100&fit=crop"
                  }
                  alt={hotel?.HotelName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  {hotel?.HotelName}
                </Typography>
                <Chip
                  label="Couple Friendly"
                  color="success"
                  size="small"
                  sx={{ mb: 1, fontWeight: "bold", fontSize: "0.7rem" }}
                />

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <LocationOn
                    sx={{ color: "text.secondary", mr: 1, fontSize: 18 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {hotel?.propertyAddress ||
                      "Madi+Marve Road, Aksa Beach, Malad (West), Mumbai, India"}
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid sx={{ xs: 12, sm: 6 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      CHECK IN
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
                    >
                      {searchData?.checkIn &&
                        searchData.checkIn.format("DD MMM YYYY")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      2 PM
                    </Typography>
                  </Grid>
                  <Grid sx={{ xs: 12, sm: 6 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      CHECK OUT
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
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
              sx={{ fontWeight: "bold", color: "#1a237e" }}
            >
              {nights} Nights | {searchData?.roomSelection?.adults || 2} Adults
              | {searchData?.rooms || 1} Room
            </Typography>
          </Paper>

          {/* Room Details with Image */}
          <Paper sx={{ p: 3, mb: 2, borderRadius: 2 }}>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box
                sx={{
                  width: 120,
                  height: 100,
                  borderRadius: 2,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <img
                  src={
                    category?.imageUrl
                      ? `http://192.168.6.7:8081${category.imageUrl}`
                      : "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=120&h=100&fit=crop"
                  }
                  alt={category?.categoryName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  {searchData?.rooms} X {category?.categoryName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {searchData?.roomSelection?.adults} Adults
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", color: "#d32f2f", mb: 1 }}
                  >
                    {plan?.planName}
                  </Typography>
                  <List dense sx={{ py: 0 }}>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 24 }}>
                        <Typography color="primary" sx={{ fontSize: "0.8rem" }}>
                          •
                        </Typography>
                      </ListItemIcon>
                      <ListItemText
                        primary="10% off on session of Spa"
                        primaryTypographyProps={{ fontSize: "0.9rem" }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 24 }}>
                        <Typography color="primary" sx={{ fontSize: "0.8rem" }}>
                          •
                        </Typography>
                      </ListItemIcon>
                      <ListItemText
                        primary="10% off on food & beverage services"
                        primaryTypographyProps={{ fontSize: "0.9rem" }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 24 }}>
                        <Typography color="primary" sx={{ fontSize: "0.8rem" }}>
                          •
                        </Typography>
                      </ListItemIcon>
                      <ListItemText
                        primary="Breakfast included"
                        primaryTypographyProps={{ fontSize: "0.9rem" }}
                      />
                    </ListItem>
                  </List>
                </Box>

                {/* <Box sx={{ backgroundColor: '#ffebee', p: 2, borderRadius: 1, border: '1px solid #ffcdd2' }}>
                  <Typography variant="subtitle2" color="#d32f2f" sx={{ fontWeight: 'bold' }}>
                    ⚠️ Non-Refundable
                  </Typography>
                  <Typography variant="body2" color="#d32f2f">
                    Refund is not applicable for this booking
                  </Typography>
                </Box> */}
              </Box>
            </Box>
          </Paper>

          {/* Traveller Details */}
          <Paper sx={{ p: 3, mb: 2, borderRadius: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#1a237e", mb: 3 }}
            >
              Guest Details
            </Typography>

            <Grid container spacing={2}>
              <Grid sx={{ xs: 12, sm: 2 }}>
                {/* <FormControl fullWidth size="small" error={!!formErrors.title}>
                  <InputLabel sx={{ fontSize: '0.9rem' }}>TITLE</InputLabel>
                  <Select
                    value={guestDetails.title}
                    label="TITLE"
                    onChange={(e) => handleGuestDetailsChange('title', e.target.value)}
                  >
                    <MenuItem value="Mr">Mr</MenuItem>
                    <MenuItem value="Ms">Ms</MenuItem>
                    <MenuItem value="Mrs">Mrs</MenuItem>
                    <MenuItem value="Dr">Dr</MenuItem>
                  </Select>
                </FormControl> */}
              </Grid>
              <Grid sx={{ xs: 12, sm: 5 }}>
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
              <Grid item xs={12} sm={5}>
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
              <Grid sx={{ xs: 12 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Email ID *"
                  placeholder="Email ID"
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
              <Grid sx={{ xs: 12 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Mobile Number *"
                  placeholder="Contact Number"
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
                        +91{" "}
                      </Box>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {/* <Box sx={{ mt: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showGST}
                    onChange={(e) => setShowGST(e.target.value)}
                  />
                }
                label="Enter GST Details (Optional)"
              />
              
              <Collapse in={showGST}>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="GST Number"
                      value={gstDetails.gstNumber}
                      onChange={(e) => handleGstDetailsChange('gstNumber', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Company Name"
                      value={gstDetails.companyName}
                      onChange={(e) => handleGstDetailsChange('companyName', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Company Address"
                      multiline
                      rows={2}
                      value={gstDetails.companyAddress}
                      onChange={(e) => handleGstDetailsChange('companyAddress', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Collapse>
            </Box> */}

            {/* {!isLoggedIn && (
              <Box sx={{ backgroundColor: '#e3f2fd', p: 2, borderRadius: 1, mt: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 1 }}>
                  <Lock sx={{ fontSize: 16, mr: 1 }} />
                  WHY SIGN UP OR LOGIN
                </Typography>
                <List dense>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <Typography color="success.main" sx={{ fontSize: '0.8rem' }}>✔</Typography>
                    </ListItemIcon>
                    <ListItemText primary="Get access to Secret Deals" />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <Typography color="success.main" sx={{ fontSize: '0.8rem' }}>✔</Typography>
                    </ListItemIcon>
                    <ListItemText primary="Book Faster - we'll save & pre-enter your details" />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <Typography color="success.main" sx={{ fontSize: '0.8rem' }}>✔</Typography>
                    </ListItemIcon>
                    <ListItemText primary="Manage your bookings from one place" />
                  </ListItem>
                </List>
                <Button 
                  variant="contained" 
                  sx={{ fontWeight: 'bold', textTransform: 'none', mt: 1 }}
                  onClick={() => navigate('/login', { state: { returnUrl: '/cart' } })}
                >
                  LOGIN / SIGN UP
                </Button>
              </Box>
            )} */}
          </Paper>
        </Grid>

        {/* Right Column - Price & Offers (40%) */}
        <Grid sx={{ xs: 12, md: 5, lg: 4 }}>
          {/* Price Summary */}
          <Paper
            sx={{ p: 3, mb: 2, borderRadius: 2, position: "sticky", top: 20 }}
          >
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
                sx={{ fontWeight: "bold", color: "#1a237e" }}
              >
                Price Summary
              </Typography>
              {/* <Button 
                size="small" 
                sx={{ fontWeight: 'bold', color: '#1a237e', textTransform: 'none' }}
                onClick={() => setShowPriceBreakup(!showPriceBreakup)}
                endIcon={showPriceBreakup ? <ExpandLess /> : <ExpandMore />}
              >
                View Price Breakup
              </Button> */}
            </Box>

            {/* Price Breakdown */}
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ border: "none", py: 1 }}>
                      <Typography variant="body2">Base Price</Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({nights} night{nights > 1 ? "s" : ""} × ₹
                        {priceBreakup.baseAmt})
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ border: "none", py: 1 }}>
                      <Typography variant="body2">
                        ₹{priceBreakup.baseAmt * nights}
                      </Typography>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell sx={{ border: "none", py: 1 }}>
                      <Typography variant="body2">Taxes</Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ border: "none", py: 1 }}>
                      <Typography variant="body2">
                        ₹{priceBreakup.gstAmt * nights}
                      </Typography>
                    </TableCell>
                  </TableRow>

                  {/* {showPriceBreakup && (
                    <>
                      <TableRow>
                        <TableCell sx={{ border: 'none', py: 0.5, pl: 2 }}>
                          <Typography variant="caption">GST</Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ border: 'none', py: 0.5 }}>
                          <Typography variant="caption">₹{priceBreakup.gstAmt}</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ border: 'none', py: 0.5, pl: 2 }}>
                          <Typography variant="caption">Service Fee</Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ border: 'none', py: 0.5 }}>
                          <Typography variant="caption">₹{serviceFee.toLocaleString()}</Typography>
                        </TableCell>
                      </TableRow>
                    </>
                  )} */}
                  {/* 
                  <TableRow>
                    <TableCell sx={{ border: 'none', py: 1 }}>
                      <Typography variant="body2" color="success.main">
                        Coupon Discount
                      </Typography>
                      <Typography variant="caption" color="success.main">
                        ({selectedCoupon})
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ border: 'none', py: 1 }}>
                      <Typography variant="body2" color="success.main">
                        -₹{couponDiscount.toLocaleString()}
                      </Typography>
                    </TableCell>
                  </TableRow> */}
                </TableBody>
              </Table>
            </TableContainer>

            <Divider sx={{ my: 1.5 }} />

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
                  sx={{ fontWeight: "bold", color: "#d32f2f" }}
                >
                  ₹{Number(totalAmt).toFixed(2)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  incl. all taxes & fees
                </Typography>
              </Box>
            </Box>

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
                "&:hover": {
                  backgroundColor: "#e65100",
                },
                "&:disabled": {
                  backgroundColor: "#cccccc",
                  color: "#666666",
                },
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              {isLoggedIn ? "Pay Now" : "Continue to payment"}
            </Button>

            {isPayNowDisabled && (
              <Alert severity="info" sx={{ mt: 1, fontSize: "0.8rem" }}>
                Please fill all mandatory guest details to proceed
              </Alert>
            )}
          </Paper>

          {/* Applied Coupon */}
          {/* {appliedCoupon && (
            <Paper sx={{ p: 2, mb: 2, borderRadius: 2, backgroundColor: '#f3e5f5', border: '1px solid #e1bee7' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Celebration sx={{ fontSize: 20, color: '#7b1fa2' }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#7b1fa2' }}>
                      {appliedCoupon.code}
                    </Typography>
                    <Typography variant="caption" color="#7b1fa2">
                      {appliedCoupon.description}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#388e3c' }}>
                  -₹{appliedCoupon.discount.toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          )} */}

          {/* Available Coupons */}
          {/* <Paper sx={{ p: 3, mb: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                More Coupons
              </Typography>
              <IconButton
                size="small"
                onClick={() => setExpandedCoupon(!expandedCoupon)}
              >
                {expandedCoupon ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>

            <Collapse in={expandedCoupon}>
              {coupons.filter(c => !c.applied).map((coupon, index) => (
                <Card 
                  key={coupon.code} 
                  sx={{ 
                    p: 2, 
                    mb: 1.5, 
                    border: '1px solid #e0e0e0',
                    cursor: 'pointer',
                    borderRadius: 2,
                    '&:hover': {
                      borderColor: '#ff6b00',
                    }
                  }}
                  onClick={() => handleCouponSelect(coupon.code)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, flex: 1 }}>
                      {coupon.icon}
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                          {coupon.code}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                          {coupon.description}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: '#ff6b00'
                      }}
                    >
                      -₹{coupon.discount.toLocaleString()}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Collapse>
          </Paper> */}

          {/* Bank Offers */}
          {/* <Paper sx={{ p: 3, mb: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
              Bank Offers
            </Typography>

            {bankOffers.map((offer, index) => (
              <Card 
                key={offer.code} 
                sx={{ 
                  p: 2, 
                  mb: 1.5,
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                      {offer.code}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                      {offer.description}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: '#ff6b00'
                    }}
                  >
                    -₹{offer.discount.toLocaleString()}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Paper> */}
        </Grid>
      </Grid>
    </>
  );
};

export default Checkout;
