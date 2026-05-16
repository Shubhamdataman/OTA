// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { login, sendOtp, verifyOtp } from '../../services/api';
// import showToast from '../../shared/toastConfig';

// // Async thunks for API calls
// export const sendOtpAction = createAsyncThunk(
//   'auth/sendOtp',
//   async (payload, { rejectWithValue }) => {
//     try {
//       const response = await sendOtp(payload);
//       if (response && response.message) {
//         return response;
//       }
//       return rejectWithValue(response?.message || 'Failed to send OTP');
//     } catch (error) {
//       return rejectWithValue(error.message || 'Failed to send OTP');
//     }
//   }
// );

// export const verifyOtpLoginAction = createAsyncThunk(
//   'auth/verifyOtpLogin',
//   async (payload, { rejectWithValue }) => {
//     try {
//       const response = await login(payload);
//       console.log("verifyOtpLoginAction", response);
//       if (response?.status === "SUCCESS") {
        
//         // Store token and userName data in localStorage
//         // localStorage.setItem('authToken', response.data?.token);
//         localStorage.setItem('userName', JSON.stringify(response?.userName));
//         localStorage.setItem('isAuthenticated', 'true');
//         return response;
//       }
//       return rejectWithValue(response?.message || 'Login failed');
//     } catch (error) {
//       return rejectWithValue(error.message || 'Login failed');
//     }
//   }
// );

// export const verifyOtpAction = createAsyncThunk(
//   'auth/verifyOtp',
//   async (payload, { rejectWithValue }) => {
//     try {
//       const response = await verifyOtp(payload);
//       if (response && response.message) {
//         return response;
//       }
//       return rejectWithValue(response?.message || 'OTP verification failed');
//     } catch (error) {
//       return rejectWithValue(error.message || 'OTP verification failed');
//     }
//   }
// );

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     userName: null,
//     // token: null,
//     isAuthenticated: false,
//     loading: false,
//     otpSent: false,
//     errors: {},
//   },
//   reducers: {
//     // Set initial auth state from localStorage
//     initializeAuth: (state) => {
//       // const token = localStorage.getItem('authToken');
//       const userName = localStorage.getItem('userName');
      
//       if (userName && userName !== null & userName !== 'undefined' ) {
//         // state.token = token;
//         state.userName = JSON.parse(userName);
//         state.isAuthenticated = true;
//       }
//     },
    
//     // Clear auth state on logout
//     logout: (state) => {
//       state.userName = null;
//       // state.token = null;
//       state.isAuthenticated = false;
//       state.otpSent = false;
//       state.errors = {};
      
//       // Clear localStorage
//       localStorage.clear();
//     },
    
//     // Clear errors
//     clearErrors: (state) => {
//       state.errors = {};
//     },
    
//     // Set OTP sent status
//     setOtpSent: (state, action) => {
//       state.otpSent = action.payload;
//     },
    
//     // Clear OTP state
//     clearOtpState: (state) => {
//       state.otpSent = false;
//       state.errors = {};
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Send OTP
//       .addCase(sendOtpAction.pending, (state) => {
//         state.loading = true;
//         state.errors = {};
//       })
//       .addCase(sendOtpAction.fulfilled, (state, action) => {
//         state.loading = false;
//         state.otpSent = true;
//         state.errors = {};
//         showToast('success', 'OTP sent successfully');
//       })
//       .addCase(sendOtpAction.rejected, (state, action) => {
//         state.loading = false;
//         state.errors = { form: action.payload };
//         showToast('error', action.payload);
//       })
      
//       // Verify OTP Login
//       .addCase(verifyOtpLoginAction.pending, (state) => {
//         state.loading = true;
//         state.errors = {};
//       })
//       .addCase(verifyOtpLoginAction.fulfilled, (state, action) => {
//         console.log("verifyOtpLoginAction", action.payload);
//         state.loading = false;
//         state.userName = action.payload.userName;
//         // state.token = action.payload.token;
//         state.isAuthenticated = true;
//         state.otpSent = false;
//         state.errors = {};
//         showToast('success', 'Login successful');
//       })
//       .addCase(verifyOtpLoginAction.rejected, (state, action) => {
//         state.loading = false;
//         state.errors = { form: action.payload };
//         showToast('error', action.payload);
//       })
      
//       // Verify OTP (for other purposes)
//       .addCase(verifyOtpAction.pending, (state) => {
//         state.loading = true;
//         state.errors = {};
//       })
//       .addCase(verifyOtpAction.fulfilled, (state, action) => {
//         state.loading = false;
//         state.errors = {};
//         showToast('success', 'OTP verified successfully');
//       })
//       .addCase(verifyOtpAction.rejected, (state, action) => {
//         state.loading = false;
//         state.errors = { form: action.payload };
//         showToast('error', action.payload);
//       });
//   },
// });

// export const { 
//   initializeAuth, 
//   logout, 
//   clearErrors, 
//   setOtpSent, 
//   clearOtpState 
// } = authSlice.actions;

// export default authSlice.reducer;





import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, sendOtp, verifyOtp } from '../../services/api';
import showToast from '../../shared/toastConfig';

/************************************
 *       ASYNC THUNKS
 ************************************/

export const sendOtpAction = createAsyncThunk(
  'auth/sendOtp',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await sendOtp(payload);
      if (response?.message) return response;

      return rejectWithValue('Failed to send OTP');
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to send OTP');
    }
  }
);

export const verifyOtpLoginAction = createAsyncThunk(
  'auth/verifyOtpLogin',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await login(payload);
      console.log("verifyOtpLoginAction", response);

      if (response?.status === 'SUCCESS') {

        // Save to localStorage
        localStorage.setItem('userName', JSON.stringify(response?.userName));
        localStorage.setItem('isAuthenticated', 'true');

        return response;
      }

      return rejectWithValue(response?.message || 'Login failed');
    } catch (error) {
      return rejectWithValue(error?.message || 'Login failed');
    }
  }
);

export const verifyOtpAction = createAsyncThunk(
  'auth/verifyOtp',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await verifyOtp(payload);

      if (response?.message) return response;

      return rejectWithValue('OTP verification failed');
    } catch (error) {
      return rejectWithValue(error?.message || 'OTP verification failed');
    }
  }
);

/************************************
 *       AUTH SLICE
 ************************************/

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userName: null,
    isAuthenticated: false,
    loading: false,
    otpSent: false,
    errors: {},
  },

  reducers: {
    initializeAuth: (state) => {
      const savedUser = localStorage.getItem('userName');
      const isAuth = localStorage.getItem('isAuthenticated');

      if (savedUser && isAuth === 'true') {
        state.userName = JSON.parse(savedUser);
        state.isAuthenticated = true;
      }
    },

    logout: (state) => {
      state.userName = null;
      state.isAuthenticated = false;
      state.otpSent = false;
      state.errors = {};

      localStorage.removeItem('userName');
      localStorage.removeItem('isAuthenticated');
    },

    clearErrors: (state) => {
      state.errors = {};
    },

    setOtpSent: (state, action) => {
      state.otpSent = action.payload;
    },

    clearOtpState: (state) => {
      state.otpSent = false;
      state.errors = {};
    },
  },

  extraReducers: (builder) => {
    builder

      /* ---------- SEND OTP ---------- */
      .addCase(sendOtpAction.pending, (state) => {
        state.loading = true;
        state.errors = {};
      })
      .addCase(sendOtpAction.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
        showToast('success', 'OTP sent successfully');
      })
      .addCase(sendOtpAction.rejected, (state, action) => {
        state.loading = false;
        state.errors = { form: action.payload };
        showToast('error', action.payload);
      })

      /* ---------- VERIFY OTP LOGIN ---------- */
      .addCase(verifyOtpLoginAction.pending, (state) => {
        state.loading = true;
        state.errors = {};
      })
      .addCase(verifyOtpLoginAction.fulfilled, (state, action) => {
        state.loading = false;
        state.userName = action.payload.userName;
        state.isAuthenticated = true;
        state.otpSent = false;

        showToast('success', 'Login successful');
      })
      .addCase(verifyOtpLoginAction.rejected, (state, action) => {
        state.loading = false;
        state.errors = { form: action.payload };
        showToast('error', action.payload);
      })

      /* ---------- VERIFY OTP (GENERAL) ---------- */
      .addCase(verifyOtpAction.pending, (state) => {
        state.loading = true;
        state.errors = {};
      })
      .addCase(verifyOtpAction.fulfilled, (state) => {
        state.loading = false;
        showToast('success', 'OTP verified successfully');
      })
      .addCase(verifyOtpAction.rejected, (state, action) => {
        state.loading = false;
        state.errors = { form: action.payload };
        showToast('error', action.payload);
      });
  },
});

export const {
  initializeAuth,
  logout,
  clearErrors,
  setOtpSent,
  clearOtpState,
} = authSlice.actions;

export default authSlice.reducer;
