import { useEffect, useRef, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
  IconButton,
  Chip,
  Rating,
  TextField,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Hotel,
  LocationOn,
  Star,
  ChevronLeft,
  ChevronRight,
  CalendarToday,
  People,
} from "@mui/icons-material";
import dayjs from "dayjs";
import CityAutocomplete from "../../components/DmLayout/CityAutocomplete";
import { getAvailableHotels } from "../../services/api";
import { formatDateToAPI } from "../../shared/dateFormatter";
import showToast from "../../shared/toastConfig";
import { useNavigate } from "react-router-dom";
import RoomsGuestsSelector from "./RoomsGuestsSelector";
import { gstRates } from "../../components/GST_Slabs";

const Home = () => {
  const theme = useTheme();
  const baseImageUrl = process.env.REACT_APP_IMAGE_URL || "";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const navigate = useNavigate();

  // Create ref for the search section
  const searchSectionRef = useRef(null);
  // Create ref for horizontal scroll
  const hotelsScrollRef = useRef(null);

  // Calculate default dates (check-in: 2 days from today, check-out: 3 days from today)
  const defaultCheckIn = dayjs().add(2, "day");
  const defaultCheckOut = dayjs().add(3, "day");

  const calculateGST = (amount) => {
    if (amount <= 7500) {
      return Math.ceil(amount * gstRates.slab1);
    } else {
      return Math.ceil(amount * gstRates.slab2);
    }
  };

  const [searchData, setSearchData] = useState({
    destination: null,
    checkIn: defaultCheckIn,
    checkOut: defaultCheckOut,
    rooms: "1",
    roomSelection: {
      // New field for detailed selection
      rooms: 1,
      adults: 2,
      children: 0,
      childrenAges: [],
    },
  });

  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Add this with your other state declarations
  const [isEllipsisActive, setIsEllipsisActive] = useState(false);
  const hotelNameRef = useRef(null);

  // Add this useEffect to detect ellipsis
  useEffect(() => {
    const checkEllipsis = () => {
      if (hotelNameRef.current) {
        const element = hotelNameRef.current;
        setIsEllipsisActive(element.scrollWidth > element.clientWidth);
      }
    };

    checkEllipsis();
    window.addEventListener("resize", checkEllipsis);

    return () => {
      window.removeEventListener("resize", checkEllipsis);
    };
  }, [searchResults]); // Re-check when search results change

  // Auto-call API on component mount with default data
  useEffect(() => {
    handleDefaultSearch();
  }, []); // Empty dependency array to run only on mount

  // Handle default search on component mount
  const handleDefaultSearch = async () => {
    setLoading(true);

    try {
      const queryParams = {
        cityCode: "", // Empty city code as requested
        fromDate: formatDateToAPI(searchData.checkIn.format("YYYY-MM-DD")),
        toDate: formatDateToAPI(searchData.checkOut.format("YYYY-MM-DD")),
        minRoomsToSell: searchData.rooms,
      };

      const payload = {
        filters: [],
        sort: [
          {
            field: "HotelName",
            order: "asc",
          },
        ],
        page: 0,
        size: 8,
      };
      const response = await getAvailableHotels(queryParams, payload);

      if (response && response.status === "success") {
        setSearchResults(response.data || []);
        showToast("success", `Found ${response.data?.length || 0} hotels`);
      } else {
        showToast("error", response?.message || "Failed to load hotels");
      }
    } catch (error) {
      console.error("Default search error:", error);
      showToast("error", "Failed to load hotels. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = async (event) => {
    event.preventDefault();
    console.log("handleSearch....///", searchData);

    if (!searchData.destination) {
      showToast("error", "Please select a destination");
      return;
    }

    if (!searchData.checkIn || !searchData.checkOut) {
      showToast("error", "Please select check-in and check-out dates");
      return;
    }

    setLoading(true);

    try {
      // Prepare query parameters for API
      const queryParams = {
        cityCode: searchData.destination?.cityCode || "",
        fromDate: formatDateToAPI(searchData.checkIn.format("YYYY-MM-DD")),
        toDate: formatDateToAPI(searchData.checkOut.format("YYYY-MM-DD")),
        minRoomsToSell: searchData.rooms,
      };

      // Prepare payload if needed (empty object if no payload required)
      const payload = {
        filters: [],
        sort: [
          {
            field: "HotelName",
            order: "asc",
          },
        ],
        page: 0,
        size: 8,
      };

      const response = await getAvailableHotels(queryParams, payload);

      if (response && response.status === "success") {
        setSearchResults(response.data || []);
        showToast("success", `Found ${response.data?.length || 0} hotels`);
      } else {
        showToast("error", response?.message || "Failed to search hotels");
      }
    } catch (error) {
      console.error("Search error:", error);
      showToast("error", "Failed to search hotels. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Hotel sx={{ fontSize: { xs: 36, md: 48 } }} />,
      title: "10,000+ Hotels",
      description: "Choose from a wide range of properties worldwide",
    },
    {
      icon: <Star sx={{ fontSize: { xs: 36, md: 48 } }} />,
      title: "Best Price Guarantee",
      description: "Find the best deals with our price match promise",
    },
    {
      icon: <LocationOn sx={{ fontSize: { xs: 36, md: 48 } }} />,
      title: "Global Coverage",
      description: "Hotels in 100+ countries and countless cities",
    },
  ];

  // Scroll to search section function
  // const scrollToSearch = () => {
  //   if (searchSectionRef.current) {
  //     searchSectionRef.current.scrollIntoView({
  //       behavior: "smooth",
  //       block: "start",
  //     });
  //   }
  // };

  // Horizontal scroll functions
  const scrollHotelsLeft = () => {
    if (hotelsScrollRef.current) {
      hotelsScrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollHotelsRight = () => {
    if (hotelsScrollRef.current) {
      hotelsScrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Handle destination change
  const handleDestinationChange = (event, newValue) => {
    setSearchData((prev) => ({
      ...prev,
      destination: newValue,
    }));
  };

  // Handle check-in date change
  const handleCheckInChange = (newValue) => {
    if (
      newValue &&
      searchData.checkOut &&
      newValue.isAfter(searchData.checkOut)
    ) {
      showToast("error", "Check-in date cannot be after check-out date");
      return;
    }

    setSearchData((prev) => ({
      ...prev,
      checkIn: newValue,
    }));
  };

  // Handle check-out date change
  const handleCheckOutChange = (newValue) => {
    if (
      newValue &&
      searchData.checkIn &&
      newValue.isBefore(searchData.checkIn)
    ) {
      showToast("error", "Check-out date cannot be before check-in date");
      return;
    }

    setSearchData((prev) => ({
      ...prev,
      checkOut: newValue,
    }));
  };

  // Handle rooms change
  const handleRoomsChange = (event) => {
    console.log("handleRoomsChange", event.target.value);
    setSearchData((prev) => ({
      ...prev,
      rooms: event.target.value,
    }));
  };

  const handleBooking = (hotel) => {
    navigate(`/detail`, {
      state: {
        hotel: hotel,
        searchData: searchData,
      },
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        {/* Search Section */}
        <Paper
          ref={searchSectionRef}
          id="search-section"
          sx={{
            mb: { xs: 4, sm: 5, md: 6 },
            borderRadius: { xs: 2, sm: 3 },
            scrollMarginTop: "80px",
            overflow: "hidden",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Hotel sx={{ color: "white" }} />
                <Typography
                  variant="h6"
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  }}
                >
                  Upto 4 Rooms
                </Typography>
                <Chip
                  label="Group Deals"
                  size="small"
                  sx={{
                    backgroundColor: "#ff6b6b",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "0.75rem",
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Chip
                  label="NEW"
                  size="small"
                  sx={{
                    backgroundColor: "#4ecdc4",
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "white",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  }}
                >
                  Book Domestic and International Property Online.
                </Typography>
                <Button
                  variant="text"
                  size="small"
                  sx={{
                    color: "#ffeb3b",
                    fontWeight: "bold",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    minWidth: "auto",
                  }}
                >
                  List Your Property
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Search Form Section */}
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{
                backgroundColor: "background.paper",
                borderRadius: 3,
                p: { xs: 2, sm: 3 },
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              }}
            >
              <Grid container spacing={2} alignItems="flex-end">
                {/* Destination */}
                <Grid size={{ xs: 12, md: 3, lg: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationOn
                      sx={{ color: "primary.main", fontSize: 20, mr: 1 }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight="bold"
                    >
                      DESTINATION
                    </Typography>
                  </Box>
                  <Box sx={{ width: "100%" }}>
                    <CityAutocomplete
                      value={searchData.destination}
                      onChange={handleDestinationChange}
                      sx={{
                        width: "100%",
                        "& .MuiOutlinedInput-root": {
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "grey.800"
                              : "#f8f9fa",
                          borderRadius: 2,
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor:
                              theme.palette.mode === "dark"
                                ? "grey.600"
                                : "grey.300",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor:
                              theme.palette.mode === "dark"
                                ? "primary.light"
                                : "primary.main",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "primary.main",
                            borderWidth: "2px",
                          },
                        },
                      }}
                    />
                  </Box>
                </Grid>

                {/* Check-in */}
                <Grid size={{ xs: 6, md: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <CalendarToday
                      sx={{ color: "primary.main", fontSize: 20, mr: 1 }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight="bold"
                    >
                      CHECK-IN
                    </Typography>
                  </Box>
                  <DatePicker
                    value={searchData.checkIn}
                    onChange={handleCheckInChange}
                    format="DD-MMM-YYYY"
                    enableAccessibleFieldDOMStructure={false}
                    slots={{
                      textField: (params) => (
                        <TextField
                          {...params}
                          fullWidth
                          size="small"
                          placeholder="dd-mmm-yyyy"
                          InputProps={{
                            ...params.InputProps,
                            sx: {
                              backgroundColor:
                                theme.palette.mode === "dark"
                                  ? "grey.800"
                                  : "#f8f9fa",
                              borderRadius: 2,
                              fontWeight: "bold",
                              color: "text.primary",
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor:
                                  theme.palette.mode === "dark"
                                    ? "grey.600"
                                    : "grey.300",
                              },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor:
                                  theme.palette.mode === "dark"
                                    ? "primary.light"
                                    : "primary.main",
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "primary.main",
                                  borderWidth: "2px",
                                },
                            },
                          }}
                        />
                      ),
                    }}
                  />
                  {/* <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                  {formattedCheckIn}
                </Typography> */}
                </Grid>

                {/* Check-out */}
                <Grid size={{ xs: 6, md: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <CalendarToday
                      sx={{ color: "primary.main", fontSize: 20, mr: 1 }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight="bold"
                    >
                      CHECK-OUT
                    </Typography>
                  </Box>
                  <DatePicker
                    value={searchData.checkOut}
                    onChange={handleCheckOutChange}
                    format="DD-MMM-YYYY"
                    enableAccessibleFieldDOMStructure={false}
                    slots={{
                      textField: (params) => (
                        <TextField
                          {...params}
                          fullWidth
                          size="small"
                          placeholder="dd-mmm-yyyy"
                          InputProps={{
                            ...params.InputProps,
                            sx: {
                              backgroundColor:
                                theme.palette.mode === "dark"
                                  ? "grey.800"
                                  : "#f8f9fa",
                              borderRadius: 2,
                              fontWeight: "bold",
                              color: "text.primary",
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor:
                                  theme.palette.mode === "dark"
                                    ? "grey.600"
                                    : "grey.300",
                              },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor:
                                  theme.palette.mode === "dark"
                                    ? "primary.light"
                                    : "primary.main",
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "primary.main",
                                  borderWidth: "2px",
                                },
                            },
                          }}
                        />
                      ),
                    }}
                  />
                  {/* <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                  {formattedCheckOut}
                </Typography> */}
                </Grid>

                {/* Rooms */}
                {/* <Grid size={{ xs: 12, md: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <People
                      sx={{ color: "primary.main", fontSize: 20, mr: 1 }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight="bold"
                    >
                      ROOMS
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    value={searchData.rooms}
                    onChange={handleRoomsChange}
                    size="small"
                    InputProps={{
                      sx: {
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "grey.800"
                            : "#f8f9fa",
                        borderRadius: 2,
                        fontWeight: "bold",
                        color: "text.primary",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor:
                            theme.palette.mode === "dark"
                              ? "grey.600"
                              : "grey.300",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor:
                            theme.palette.mode === "dark"
                              ? "primary.light"
                              : "primary.main",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "primary.main",
                          borderWidth: "2px",
                        },
                      },
                    }}/>
                </Grid> */}

                {/* Rooms - Replace the TextField with this */}
                <Grid size={{ xs: 12, md: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <People
                      sx={{ color: "primary.main", fontSize: 20, mr: 1 }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight="bold"
                    >
                      ROOMS & GUESTS
                    </Typography>
                  </Box>
                  <RoomsGuestsSelector
                    value={searchData.rooms}
                    onChange={(newSelection) => {
                      setSearchData((prev) => ({
                        ...prev,
                        rooms: newSelection.rooms.toString(), // Keep string format for API
                        roomSelection: newSelection,
                      }));
                    }}
                    theme={theme}
                  />
                </Grid>

                {/* Search Button */}
                <Grid size={{ xs: 12, md: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    type="submit"
                    sx={{
                      height: "48px",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      backgroundColor: "#ff6b35",
                      background: "linear-gradient(45deg, #ff6b35, #ff8e53)",
                      borderRadius: 2,
                      boxShadow: "0 4px 15px rgba(255, 107, 53, 0.4)",
                      "&:hover": {
                        background: "linear-gradient(45deg, #e55a2b, #ff7b40)",
                        boxShadow: "0 6px 20px rgba(255, 107, 53, 0.6)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "SEARCH"
                    )}
                  </Button>
                </Grid>
              </Grid>

              {/* Last Search Info */}
              {/* <Box
                sx={{
                  mt: 3,
                  pt: 2,
                  borderTop: `1px dashed ${
                    theme.palette.mode === "dark" ? "grey.600" : "grey.300"
                  }`,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <History sx={{ fontSize: 16 }} />
                  Last Search:
                  <Box
                    component="span"
                    sx={{ color: "primary.main", fontWeight: "bold", ml: 1 }}
                  >
                    {searchData.destination?.name || "Goa"} • {formattedCheckIn}{" "}
                    • {formattedCheckOut} • {searchData.rooms} Room
                    {searchData.rooms > 1 ? "s" : ""}
                  </Box>
                </Typography>
              </Box> */}
            </Box>
          </Box>
        </Paper>

        {/* Popular Destinations */}
        {/* <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: { xs: "1.5rem", sm: "2rem" },
            }}
          >
            Popular Destinations
          </Typography>
          <Grid container spacing={2}>
            {[
              "Jaipur",
              "Shimla",
              "Varanasi",
              "Srinagar",
              "Udaipur",
              "Rishikesh",
            ].map((city) => (
              <Grid size={{ xs: 6, sm: 4, md: 2 }} key={city}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "primary.light",
                      color: "white",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    {city}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box> */}

        {/* Featured Hotels - Horizontal Scroll Section */}
        <Box sx={{ mb: 6 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "1.5rem", sm: "2rem" },
              }}
            >
              {searchResults.length > 0
                ? "Available Hotels"
                : "Featured Hotels"}
            </Typography>

            {/* Navigation Arrows - Hide on mobile */}
            {!isMobile && searchResults.length > 0 && (
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={scrollHotelsLeft}
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  }}
                >
                  <ChevronLeft />
                </IconButton>
                <IconButton
                  onClick={scrollHotelsRight}
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  }}
                >
                  <ChevronRight />
                </IconButton>
              </Box>
            )}
          </Box>

          {/* Horizontal Scroll Container */}
          <Box
            ref={hotelsScrollRef}
            sx={{
              display: "flex",
              gap: 3,
              overflowX: "auto",
              scrollBehavior: "smooth",
              py: 2,
              px: 1,
              "&::-webkit-scrollbar": {
                height: 8,
                display: isMobile ? "none" : "block",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "grey.100",
                borderRadius: 4,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "primary.main",
                borderRadius: 4,
              },
              // Hide scrollbar on mobile
              scrollbarWidth: isMobile ? "none" : "thin",
            }}
          >
            {searchResults.length > 0 ? (
              // Dynamic hotels from API response
              searchResults.map((hotel, index) => (
                <Card
                  key={hotel.hotelCode || index}
                  sx={{
                    minWidth: 280,
                    maxWidth: 280,
                    flexShrink: 0,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  {/* Hotel Image */}
                  <Box
                    sx={{
                      position: "relative",
                      height: 200,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      component="img"
                      src={baseImageUrl + hotel.imageUrl}
                      alt={hotel.HotelName}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                      // onError={(e) => {
                      //   e.target.src =
                      //     "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop";
                      // }}
                    />

                    {/* City Badge */}
                    <Chip
                      label={hotel.CityName}
                      color="primary"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        fontWeight: "bold",
                      }}
                    />

                    {/* Hotel Type Badge */}
                    {/* <Chip
                      label="Available"
                      variant="outlined"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        backgroundColor: "rgba(255,255,255,0.9)",
                        fontWeight: "bold",
                      }}
                    /> */}
                  </Box>

                <CardContent sx={{ p: 2 }}>
  {/* Hotel Name and Location (same as above) */}
  <Tooltip
    title={hotel.HotelName}
    arrow
    placement="top"
    disableHoverListener={!isEllipsisActive}
  >
    <Typography
      ref={hotelNameRef}
      variant="h6"
      component="h3"
      gutterBottom
      sx={{
        fontWeight: "bold",
        fontSize: "0.8rem",
        height: "2.5em",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        textOverflow: "ellipsis",
        lineHeight: "1.2",
      }}
    >
      {hotel.HotelName}
    </Typography>
  </Tooltip>

  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
    <LocationOn
      sx={{
        fontSize: 16,
        color: "text.secondary",
        mr: 0.5,
      }}
    />
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {hotel.propertyAddress}
    </Typography>
  </Box>

  {/* Rating and Reviews */}
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 2,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Rating
        value={4.2}
        readOnly
        size="small"
        precision={0.1}
      />
      <Typography
        variant="body2"
        sx={{ ml: 1, fontWeight: "bold" }}
      >
        4.2
      </Typography>
    </Box>
    <Typography variant="body2" color="text.secondary">
      (120 reviews)
    </Typography>
  </Box>

  {/* Price and Book Button - Using Grid for perfect alignment */}
  <Grid container alignItems="flex-end" spacing={1}>
    <Grid item xs={7}>
      <Typography
        variant="h6"
        color="primary"
        sx={{ fontWeight: "bold", lineHeight: 1 }}
      >
        {`Rs. ${hotel.minRate.toFixed(2)}`}
      </Typography>
      <Typography 
        variant="caption" 
        color="text.secondary"
        sx={{ display: 'block', lineHeight: 1.2 }}
      >
        per night
      </Typography>
      <Typography 
        variant="caption" 
        color="text.secondary"
        sx={{ display: 'block', lineHeight: 1.2 }}
      >
        + ₹{calculateGST(hotel.minRate).toFixed(2)} taxes & fees
      </Typography>
    </Grid>
    <Grid item xs={5}>
      <Button
        variant="contained"
        size="small"
        fullWidth
        sx={{
          fontWeight: "bold",
          borderRadius: 2,
          py: 0.8,
        }}
        onClick={() => handleBooking(hotel)}
      >
        Book Now
      </Button>
    </Grid>
  </Grid>
</CardContent>
                </Card>
              ))
            ) : (
              // Loading state or no results
              <Box sx={{ textAlign: "center", width: "100%", py: 4 }}>
                {loading ? (
                  <CircularProgress size={40} />
                ) : (
                  <Typography variant="h6" color="text.secondary">
                    No hotels found. Try adjusting your search criteria.
                  </Typography>
                )}
              </Box>
            )}
          </Box>

          {/* Scroll hint for mobile */}
          {isMobile && searchResults.length > 0 && (
            <Typography
              variant="caption"
              color="text.secondary"
              align="center"
              sx={{
                display: "block",
                mt: 1,
                fontStyle: "italic",
              }}
            >
              ← Scroll to see more hotels →
            </Typography>
          )}
        </Box>

        {/* Features Section */}
        <Grid
          container
          spacing={{ xs: 2, sm: 3, md: 4 }}
          sx={{ mb: { xs: 4, sm: 5, md: 6 } }}
        >
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card
                sx={{
                  textAlign: "center",
                  p: { xs: 1, sm: 2 },
                  height: "100%",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ color: "primary.main", mb: { xs: 1, sm: 2 } }}>
                    {feature.icon}
                  </Box>
                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    gutterBottom
                    sx={{
                      fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </LocalizationProvider>
  );
};

export default Home;
