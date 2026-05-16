import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Box,
  Switch,
  FormControlLabel,
  Container,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  WbSunny,
  NightsStay,
  AccountCircle,
  Menu as MenuIcon,
  Logout,
  BookOnline,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../redux/store/themeSlice";
import { Link, useNavigate } from "react-router-dom";
import { selectIsAuthenticated } from "../../redux/store/selectors/authSelectors";
import { logout } from "../../redux/store/authSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const logOutUser = () => {
    // Implement your logout logic here
    dispatch(logout());
    handleUserMenuClose();
    navigate("/");
  };

  const navigationItems = ["Home", "Hotels", "Deals", "About"];

  // Mobile Drawer Menu
  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={handleMobileMenuToggle}
    >
      <List>
        {navigationItems.map((item) => (
          <ListItem button key={item}>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="static"
      elevation={2}
      sx={{ backgroundColor: themeMode === "dark" ? "black" : "white" }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ py: { xs: 1, md: 0 } }}>
          {/* Logo and Brand */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Link to="/home" style={{ textDecoration: "none" }}>
              <Box
                sx={{
                  letterSpacing: { xs: "0.1rem", sm: "0.1rem" },
                  fontSize: { xs: 12, sm: 16 },
                }}
              >
                <Box
                  sx={{
                    color: "#ff9800",
                    display: "inline-block",
                    letterSpacing: "initial",
                    fontWeight: '1000',
                    textAlign: { xs: "center", sm: "none" },
                  }}
                >
                  dataman
                </Box>{" "}
                <Box display={"inline-block"} color={ themeMode === 'dark' ? "white" : "black"} fontWeight={700}>
                  <Box
                    sx={{
                      display: "inline-block",
                      fontSize: { xs: 16, sm: 22 },
                    }}
                  >
                    O
                  </Box>
                  TA
                </Box>
              </Box>
            </Link>
          </Box>

          {/* Navigation Links - Hidden on mobile */}
          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { md: 2, lg: 3 },
              }}
            >
              {navigationItems.map((item) => (
                <Button
                  key={item}
                  // color={themeMode === 'dark'?"white":"black" }
                  sx={{
                    fontWeight: 600,
                    fontSize: { md: "0.875rem", lg: "1rem" },
                    color: themeMode === "dark" ? "white" : "black",
                  }}
                  onClick={() => {
                    if (item === "Home") navigate("/");
                  }}
                >
                  {item}
                </Button>
              ))}
            </Box>
          )}

          {/* Theme Toggle and User Actions */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              ml: { xs: 1, md: 2 },
            }}
          >
            {/* Theme Toggle - Adjust label visibility based on screen size */}
            {!isTablet ? (
              <FormControlLabel
                control={
                  <Switch
                    checked={themeMode === "dark"}
                    onChange={handleThemeToggle}
                    icon={<WbSunny sx={{ color: "#ffb74d" }} />}
                    checkedIcon={<NightsStay sx={{ color: "#90caf9" }} />}
                  />
                }
                label={themeMode === "dark" ? "Dark" : "Light"}
                sx={{ color: themeMode === "dark" ? "white" : "black", mr: 1 }}
              />
            ) : (
              <IconButton onClick={handleThemeToggle} color="inherit">
                {themeMode === "dark" ? <NightsStay /> : <WbSunny />}
              </IconButton>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color={themeMode === "dark" ? "white" : "black"}
                aria-label="open menu"
                edge="start"
                onClick={handleMobileMenuToggle}
                sx={{ ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* User Menu - Hidden on small mobile */}
            {!isMobile && (
              <>
                <IconButton
                  color={themeMode === "dark" ? "white" : "black"}
                  onClick={handleUserMenuOpen}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleUserMenuClose}
                >
                  <MenuItem onClick={handleUserMenuClose}>Profile</MenuItem>
                  <MenuItem onClick={handleUserMenuClose}>My Bookings</MenuItem>
                  <MenuItem onClick={logOutUser}>Logout</MenuItem>
                </Menu>
              </>
            )}

            {/* Login Button - Adjust size based on screen */}
            {isAuthenticated ? null : (
              <Button
                color="inherit"
                variant="outlined"
                size={isMobile ? "small" : "medium"}
                sx={{
                  borderColor: themeMode === "dark" ? "white" : "black",
                  color: themeMode === "dark" ? "white" : "black",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  px: { xs: 1, sm: 2 },
                  "&:hover": {
                    backgroundColor: "grey",
                  },
                }}
                onClick={() => {
                  navigate("/login");
                }}
              >
                {isMobile ? "Login" : "Sign In"}
              </Button>
            )}
          </Box>
        </Toolbar>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={mobileMenuOpen}
          onClose={handleMobileMenuToggle}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 250,
              backgroundColor: "background.paper",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Container>
    </AppBar>
  );
};

export default Header;
