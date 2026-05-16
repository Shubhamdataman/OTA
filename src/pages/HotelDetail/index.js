import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  Button,
  Chip,
  Rating,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import {
  LocationOn,
  Wifi,
  AcUnit,
  Restaurant,
  Pool,
  FitnessCenter,
  LocalParking,
  ArrowBack,
  KingBed,
  Bathtub,
  Tv,
  Coffee,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getHotelDetails } from "../../services/api";
import showToast from "../../shared/toastConfig";
import dayjs from "dayjs";
import { gstRates } from "../../components/GST_Slabs";

// Import Redux actions and selectors
import {
  setRoomCategories,
  setHotelLoading,
  setSelectedPlan,
  clearHotelDetails,
  setTotalAmt,
  setPriceBreakup,
} from "../../redux/store/hotelSearchSlice";
import {
  selectSelectedHotel,
  selectRoomCategories,
  selectHotelLoading,
  selectSelectedPlan,
  selectAllSearchData,
} from "../../redux/store/selectors/hotelSearchSelectors";

const HotelDetails = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  // Select state from Redux
  const hotelData = useSelector(selectSelectedHotel);
  const roomCategories = useSelector(selectRoomCategories);
  const loading = useSelector(selectHotelLoading);
  const selectedPlan = useSelector(selectSelectedPlan);
  const searchData = useSelector(selectAllSearchData);

  const noOfAdults = searchData?.roomSelection?.adults;
  const noOfChildren = searchData?.roomSelection?.children;
  const noOfRooms = searchData?.rooms;
  const [activeTab, setActiveTab] = useState(0);

  const getSafeDate = (dateObj) => {
    if (!dateObj) return null;

    if (dateObj.$d && dateObj.$isDayjsObject) {
      return dayjs(dateObj.$d);
    }

    if (dayjs.isDayjs(dateObj)) {
      return dateObj;
    }

    return dayjs(dateObj);
  };

  // Calculate number of nights - no need for getSafeDate anymore
  const calculateNights = () => {
    if (!searchData?.checkIn || !searchData?.checkOut) return 1;

    try {
      return searchData.checkOut.diff(searchData.checkIn, "day") || 1;
    } catch (error) {
      return 1;
    }
  };

  const nights = calculateNights();

  useEffect(() => {
    const fetchHotelDetails = async () => {
      if (!hotelData) {
        showToast("error", "No hotel selected. Please search again.");
        navigate("/");
        return;
      }

      dispatch(setHotelLoading(true));

      try {
        const queryParams = {
          propertyCode: hotelData.hotelCode,
          fromDate: searchData?.checkIn?.format("YYYY-MM-DD"),
          toDate: searchData?.checkOut?.format("YYYY-MM-DD"),
        };

        const payload = {
          page: 0,
          size: 100,
        };

        const roomResponse = await getHotelDetails(queryParams, payload);

        if (roomResponse && roomResponse.status === "success") {
          const categories = roomResponse.data || [];
          dispatch(setRoomCategories(categories));

          const initialSelected = {};
          categories.forEach((category) => {
            if (category.plans && category.plans.length > 0) {
              initialSelected[category.categoryCode] = category.plans[0];
            }
          });
          // dispatch(setSelectedPlan(initialSelected));
        } else {
          showToast(
            "error",
            roomResponse?.message || "Failed to load hotel details"
          );
        }
      } catch (error) {
        console.error("Error fetching hotel details:", error);
        showToast("error", "Failed to load hotel details");
      } finally {
        dispatch(setHotelLoading(false));
      }
    };

    fetchHotelDetails();
  }, [hotelData]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePlanSelect = (categoryCode, plan) => {
    const newSelectedPlan = {
      ...selectedPlan,
      [categoryCode]: plan,
    };
    // dispatch(setSelectedPlan(newSelectedPlan));
  };

  const handleBookRoom = (category, plan, baseRate, gstAmt) => {
    showToast(
      "success",
      `Selected ${category.categoryName} - ${plan.planName}`
    );
    dispatch(setSelectedPlan({ [category.categoryCode]: plan }));
    const totalAmt = getTotalPrice(baseRate, gstAmt);
    dispatch(setTotalAmt(totalAmt));
    const priceBreakup = {
      baseAmt: baseRate,
      gstAmt: gstAmt,
      nights: nights,
    };
    dispatch(setPriceBreakup(priceBreakup));

    navigate("/checkout");
  };

  const handleBackToSearch = () => {
    navigate("/");
  };

  const getTotalPrice = (perNightRate, gst) => {
    return (perNightRate + gst) * nights;
  };

  const getPerNightPrice = (plan) => {
    const rates = plan.occupancyRates || {};
    if (noOfAdults === 1) {
      return rates.singleGuestRate || 0;
    } else if (noOfAdults === 2) {
      return rates.singleGuestRate + rates.extraadultrate || 0;
    } else if (noOfAdults === 3) {
      return rates.doubleGuestRate + rates.extraadultrate || 0;
    } else if (noOfAdults === 4) {
      return rates.tripleGuestRate + rates.extraadultrate || 0;
    } else if (noOfAdults === 5) {
      return rates.quadGuestRate + rates.extraadultrate || 0;
    }
  };

  const getAmenities = () => {
    return [
      { icon: <Wifi />, name: "Free WiFi" },
      { icon: <AcUnit />, name: "Air Conditioning" },
      { icon: <Restaurant />, name: "Restaurant" },
      { icon: <Pool />, name: "Swimming Pool" },
      { icon: <FitnessCenter />, name: "Fitness Center" },
      { icon: <LocalParking />, name: "Free Parking" },
      { icon: <KingBed />, name: "Comfortable Beds" },
      { icon: <Bathtub />, name: "Private Bathroom" },
    ];
  };

  const getRoomAmenities = () => {
    return [
      { icon: <KingBed />, name: "King Bed" },
      { icon: <Bathtub />, name: "Attached Bathroom" },
      { icon: <Tv />, name: "LED TV" },
      { icon: <AcUnit />, name: "Air Conditioner" },
      { icon: <Wifi />, name: "Free WiFi" },
      { icon: <Coffee />, name: "Tea/Coffee Maker" },
    ];
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (!hotelData) {
    return (
      <Container sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h5">Hotel not found</Typography>
        <Button onClick={handleBackToSearch} sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Container>
    );
  }

  const calculateGST = (amount) => {
    if (amount <= 7500) {
      return Math.ceil(amount * gstRates.slab1);
    } else {
      return Math.ceil(amount * gstRates.slab2);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBackToSearch}
          sx={{ mb: 2, color: "primary.main" }}
        >
          Back to Search
        </Button>

        {/* Search Summary Bar */}
        <Paper
          sx={{ p: 2, mb: 3, backgroundColor: "grey.50", borderRadius: 2 }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid sx={{ xs: 12, sm: 3 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="medium"
              >
                CHECK-IN
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {searchData?.checkIn
                  ? searchData.checkIn.format("DD MMM YYYY")
                  : "Flexible"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                2 PM
              </Typography>
            </Grid>
            <Grid sx={{ xs: 12, sm: 3 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="medium"
              >
                CHECK-OUT
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {searchData?.checkOut
                  ? searchData.checkOut.format("DD MMM YYYY")
                  : "Flexible"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                12 PM
              </Typography>
            </Grid>
            <Grid sx={{ xs: 12, sm: 3 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="medium"
              >
                ROOMS & GUESTS
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {searchData?.rooms || "1"} Room,{" "}
                {searchData?.roomSelection?.adults || "2"} Adults
              </Typography>
            </Grid>
            <Grid
              sx={{ xs: 12, sm: 3, textAlign: { xs: "left", sm: "right" } }}
            >
              <Button
                variant="outlined"
                size="medium"
                onClick={handleBackToSearch}
                sx={{ fontWeight: "bold", minWidth: 140 }}
              >
                MODIFY SEARCH
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Hotel Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 3,
            flexDirection: isMobile ? "column" : "row",
            mb: 4,
          }}
        >
          <Box
            sx={{
              width: isMobile ? "100%" : 400,
              height: isMobile ? 250 : 300,
              borderRadius: 2,
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <img
              src={
                hotelData.imageUrl
                  ? `http://192.168.6.7:8081${hotelData.imageUrl}`
                  : "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
              }
              alt={hotelData.HotelName}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "1.75rem", md: "2.125rem" },
              }}
            >
              {hotelData.HotelName}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <LocationOn sx={{ color: "text.secondary" }} />
              <Typography variant="body1" color="text.secondary">
                {hotelData.propertyAddress}, {hotelData.CityName}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 3,
                flexWrap: "wrap",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "success.main",
                  color: "white",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  4.2/5
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", color: "success.main" }}
              >
                Excellent
              </Typography>
              <Typography variant="body2" color="text.secondary">
                (124 reviews)
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {getAmenities()
                .slice(0, 4)
                .map((amenity, index) => (
                  <Chip
                    key={index}
                    icon={amenity.icon}
                    label={amenity.name}
                    variant="outlined"
                    size="small"
                  />
                ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Tabs Section */}
      <Paper sx={{ width: "100%", mb: 4, borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isSmallMobile ? "scrollable" : "standard"}
          scrollButtons={isSmallMobile ? "auto" : false}
          centered={!isSmallMobile}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": {
              fontWeight: "bold",
              minWidth: { xs: 100, sm: 120 },
            },
          }}
        >
          <Tab label="Rooms & Rates" />
          <Tab label="Amenities" />
          <Tab label="Location" />
          <Tab label="Policies" />
          <Tab label="Reviews" />
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {activeTab === 0 && (
            <Box>
              {roomCategories.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {roomCategories.map((category, index) => (
                    <Card
                      key={category.categoryCode}
                      sx={{
                        p: { xs: 2, md: 3 },
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        boxShadow: 2,
                      }}
                    >
                      <Grid container spacing={3}>
                        {/* Left Side - Portrait Room Image & Basic Info */}
                        <Grid sx={{ xs: 12, md: 4 }}>
                          <Box
                            sx={{
                              width: "100%",
                              height: { xs: 200, md: 320 },
                              borderRadius: 2,
                              overflow: "hidden",
                              mb: 2,
                            }}
                          >
                            <img
                              src={
                                category.imageUrl
                                  ? `http://192.168.6.7:8081${category.imageUrl}`
                                  : "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=400&fit=crop"
                              }
                              alt={category.categoryName}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </Box>

                          <Typography
                            variant="h6"
                            gutterBottom
                            sx={{ fontWeight: "bold" }}
                          >
                            {category.categoryName}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            450 sq.ft (42 sq.mt) • City View
                          </Typography>

                          <Box sx={{ mt: 2 }}>
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{ fontWeight: "bold" }}
                            >
                              Room Amenities:
                            </Typography>
                            <Grid container spacing={1}>
                              {getRoomAmenities().map((amenity, idx) => (
                                <Grid sx={{ xs: 6 }} key={idx}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        color: "primary.main",
                                        fontSize: 16,
                                      }}
                                    >
                                      {amenity.icon}
                                    </Box>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {amenity.name}
                                    </Typography>
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        </Grid>

                        {/* Right Side - Horizontal Scrollable Rate Plans */}
                        <Grid sx={{ xs: 12, md: 8 }}>
                          <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                              fontWeight: "bold",
                              color: "primary.main",
                              mb: 2,
                            }}
                          >
                            Choose your rate plan:
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              overflowX: "auto",
                              pb: 2,
                              minHeight: { md: 320 },
                              "&::-webkit-scrollbar": {
                                height: 8,
                              },
                              "&::-webkit-scrollbar-track": {
                                backgroundColor: "grey.100",
                                borderRadius: 4,
                              },
                              "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "grey.400",
                                borderRadius: 4,
                              },
                              "&::-webkit-scrollbar-thumb:hover": {
                                backgroundColor: "grey.600",
                              },
                            }}
                          >
                            {category.plans &&
                              category.plans.map((plan, planIndex) => (
                                <Paper
                                  key={plan.ratePlanCode}
                                  sx={{
                                    minWidth: 300,
                                    maxWidth: 350,
                                    p: 2.5,
                                    border: "2px solid",
                                    borderColor:
                                      selectedPlan[category.categoryCode]
                                        ?.ratePlanCode === plan.ratePlanCode
                                        ? "primary.main"
                                        : "grey.300",
                                    backgroundColor:
                                      selectedPlan[category.categoryCode]
                                        ?.ratePlanCode === plan.ratePlanCode
                                        ? "primary.50"
                                        : "background.paper",
                                    borderRadius: 2,
                                    cursor: "pointer",
                                    transition: "all 0.2s ease-in-out",
                                    display: "flex",
                                    flexDirection: "column",
                                    "&:hover": {
                                      borderColor: "primary.main",
                                      boxShadow: 2,
                                    },
                                  }}
                                  onClick={() =>
                                    handlePlanSelect(
                                      category.categoryCode,
                                      plan
                                    )
                                  }
                                >
                                  <Box sx={{ mb: 2 }}>
                                    <Typography
                                      variant="subtitle1"
                                      gutterBottom
                                      sx={{
                                        fontWeight: "bold",
                                        color: "primary.main",
                                      }}
                                    >
                                      {plan.planName}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      gutterBottom
                                    >
                                      {plan.roomPlanDesc ||
                                        "Includes all basic amenities"}
                                    </Typography>
                                  </Box>

                                  <Box sx={{ mb: 2 }}>
                                    <Chip
                                      label="10% off on F&B"
                                      size="small"
                                      color="primary"
                                      variant="filled"
                                      sx={{
                                        mr: 1,
                                        mb: 1,
                                        fontWeight: "bold",
                                        fontSize: "0.7rem",
                                      }}
                                    />
                                    {plan.planName
                                      ?.toLowerCase()
                                      .includes("refundable") ? (
                                      <Chip
                                        label="Refundable"
                                        size="small"
                                        color="success"
                                        variant="outlined"
                                        sx={{
                                          mb: 1,
                                          fontWeight: "bold",
                                          fontSize: "0.7rem",
                                        }}
                                      />
                                    ) : (
                                      <Chip
                                        label="Non-Refundable"
                                        size="small"
                                        color="error"
                                        variant="outlined"
                                        sx={{
                                          mb: 1,
                                          fontWeight: "bold",
                                          fontSize: "0.7rem",
                                        }}
                                      />
                                    )}
                                  </Box>

                                  <Box sx={{ mb: 2, flex: 1 }}>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{ lineHeight: 1.6 }}
                                    >
                                      • 10% off on Food & Beverage services
                                      <br />
                                      • Free WiFi
                                      <br />
                                      • Air Conditioning
                                      <br />
                                    </Typography>
                                  </Box>

                                  <Box sx={{ mt: "auto" }}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        mb: 1,
                                      }}
                                    >
                                      <Box>
                                        <Typography
                                          variant="body2"
                                          sx={{ fontWeight: "bold" }}
                                        >
                                          ₹{getPerNightPrice(plan)} per night
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                        >
                                          + ₹
                                          {calculateGST(
                                            getPerNightPrice(plan)
                                          ).toFixed(2)}{" "}
                                          taxes & fees
                                        </Typography>
                                      </Box>
                                      <Box sx={{ textAlign: "right" }}>
                                        <Typography
                                          variant="h6"
                                          color="primary"
                                          sx={{ fontWeight: "bold" }}
                                        >
                                          ₹
                                          {getTotalPrice(
                                            getPerNightPrice(plan),
                                            calculateGST(getPerNightPrice(plan))
                                          ).toFixed(2)}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                        >
                                          for {nights} night
                                          {nights > 1 ? "s" : ""}
                                        </Typography>
                                      </Box>
                                    </Box>

                                    <Button
                                      variant="contained"
                                      size="medium"
                                      fullWidth
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleBookRoom(
                                          category,
                                          plan,
                                          getPerNightPrice(plan),
                                          calculateGST(getPerNightPrice(plan))
                                        );
                                      }}
                                      sx={{
                                        fontWeight: "bold",
                                        mt: 1,
                                      }}
                                    >
                                      SELECT ROOM
                                    </Button>
                                  </Box>
                                </Paper>
                              ))}
                          </Box>
                        </Grid>
                      </Grid>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Typography
                  variant="h6"
                  color="text.secondary"
                  textAlign="center"
                  py={4}
                >
                  No rooms available for the selected dates
                </Typography>
              )}
            </Box>
          )}

          {/* Other tab contents remain the same */}
          {activeTab === 1 && (
            <Box>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: "bold", mb: 3 }}
              >
                Hotel Amenities
              </Typography>
              <Grid container spacing={2}>
                {getAmenities().map((amenity, index) => (
                  <Grid sx={{ xs: 6, sm: 4, md: 3 }} key={index}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 1,
                      }}
                    >
                      <Box sx={{ color: "primary.main", fontSize: 20 }}>
                        {amenity.icon}
                      </Box>
                      <Typography variant="body1">{amenity.name}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: "bold", mb: 3 }}
              >
                Location
              </Typography>
              <Typography variant="body1" paragraph>
                {hotelData.propertyAddress}, {hotelData.CityName}
              </Typography>
              <Box
                sx={{
                  height: 300,
                  backgroundColor: "grey.100",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography color="text.secondary">
                  Map would be displayed here
                </Typography>
              </Box>
            </Box>
          )}

          {activeTab === 3 && (
            <Box>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: "bold", mb: 3 }}
              >
                Hotel Policies
              </Typography>
              <Box sx={{ maxWidth: 600 }}>
                <Typography variant="h6" gutterBottom>
                  Check-in / Check-out
                </Typography>
                <Typography variant="body1" paragraph>
                  Check-in: 2:00 PM | Check-out: 12:00 PM
                </Typography>

                <Typography variant="h6" gutterBottom>
                  Cancellation Policy
                </Typography>
                <Typography variant="body1" paragraph>
                  Free cancellation until 24 hours before check-in.
                  Cancellations made within 24 hours of check-in will be charged
                  the first night's room rate.
                </Typography>
              </Box>
            </Box>
          )}

          {activeTab === 4 && (
            <Box>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: "bold", mb: 3 }}
              >
                Guest Reviews
              </Typography>
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h4" color="primary" gutterBottom>
                  4.2/5
                </Typography>
                <Rating value={4.2} readOnly precision={0.1} size="large" />
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Based on 124 reviews
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default HotelDetails;
