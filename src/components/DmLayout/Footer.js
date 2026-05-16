import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const footerSections = [
    {
      title: 'Company',
      links: ['About Us', 'Blog', 'Press']
    },
    {
      title: 'Support',
      links: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service']
    },
    {
      title: 'Top Cities',
      links: ['Jaipur', 'Shimla', 'Varanasi', 'Srinagar']
    },
    {
      title: 'Partners',
      links: ['Hotel Chains', 'Affiliate Program', 'List Your Property', 'Become a Partner']
    }
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.paper',
        py: { xs: 3, md: 4 },
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* Company Info */}
          <Grid sx={{xs:12, md:6, lg:4}} >
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ fontWeight: 'bold', fontSize: { xs: '1.1rem', md: '1.25rem' } }}
            >
              HotelBooking
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              paragraph
              sx={{ fontSize: { xs: '0.875rem', md: '0.9rem' } }}
            >
              Your trusted partner for hotel bookings worldwide. 
              Find the perfect stay for your next adventure with our 
              extensive collection of hotels and resorts.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton color="primary" size="small">
                <Facebook fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
              <IconButton color="primary" size="small">
                <Twitter fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
              <IconButton color="primary" size="small">
                <Instagram fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
              <IconButton color="primary" size="small">
                <LinkedIn fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            </Box>
          </Grid>

          {/* Footer Links - Responsive Grid */}
          {footerSections.map((section, index) => (
            <Grid sx={{xs:6, sm:3, md:2}} key={section.title}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '0.9rem', md: '1rem' }
                }}
              >
                {section.title}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {section.links.map((link) => (
                  <Link 
                    href="#" 
                    key={link}
                    color="text.secondary" 
                    underline="hover"
                    sx={{ 
                      fontSize: { xs: '0.8rem', md: '0.875rem' },
                      cursor: 'pointer'
                    }}
                  >
                    {link}
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Copyright - Stack on mobile */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
          >
            © {new Date().getFullYear()} HotelBooking. All rights reserved.
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 1, sm: 3 },
            flexWrap: 'wrap'
          }}>
            <Link 
              href="#" 
              color="text.secondary" 
              underline="hover" 
              variant="body2"
              sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
            >
              Privacy Policy
            </Link>
            <Link 
              href="#" 
              color="text.secondary" 
              underline="hover" 
              variant="body2"
              sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
            >
              Terms of Service
            </Link>
            <Link 
              href="#" 
              color="text.secondary" 
              underline="hover" 
              variant="body2"
              sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
            >
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;