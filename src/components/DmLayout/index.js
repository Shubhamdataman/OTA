import { Box, CssBaseline} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import Header from './Header';
import Footer from './Footer';
import { createAppTheme } from '../../redux/theme';

const Layout = ({ children }) => {
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = createAppTheme(themeMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Header />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: { xs: 1, sm: 2, md: 3 },
            px: { xs: 1, sm: 2 },
            minHeight: 'calc(100vh - 140px)',
            width: '100%',
          }}
        >
          {children}
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default Layout;