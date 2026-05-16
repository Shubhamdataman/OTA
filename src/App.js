import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './redux/store';
import AppRoutes from './routes/AppRoutes';
import { initializeAuth } from './redux/store/authSlice';
import { ToastContainer } from 'react-toastify';

// Component to initialize auth state
const AuthInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize auth state from localStorage
    dispatch(initializeAuth());
  }, [dispatch]);

  return <AppRoutes />;
};

function App() {
  return (
    <Provider store={store}>
      <ToastContainer />
      <AuthInitializer />
    </Provider>
  );
}

export default App;
