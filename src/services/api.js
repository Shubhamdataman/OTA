import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: baseUrl,
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

const handleRequest = async (request) => {
  try {
    const response = await request;
    
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    console.error("API Request Error:", error);
    // You can show toast notification here if needed
    // showToast("error", error.message || "API request failed");
    return {
      status: "error",
      message: error.message || "API request failed",
      data: null
    };
  }
};

export const sendOtp = (payload) =>
  handleRequest(api.post(`auth/send-otp`, payload));

export const verifyOtp = (payload) =>
  handleRequest(api.post(`auth/verify-otp`, payload));

export const signUp = (payload) =>
  handleRequest(api.post(`auth/signup`, payload));

export const login = (payload) =>
  handleRequest(api.post(`auth/verify-otp-login`, payload));

export const getCityList = (payload) =>
  handleRequest(api.post(`location/get-city-list`, payload));

export const getAvailableHotels = (queryParams, payload) =>
  handleRequest(api.post(`dashboard/getTxtHSearchAvailableHotels`, payload, {
    params: queryParams
  }));

export const getHotelDetails = (queryParams, payload) =>
  handleRequest(api.post(`dashboard/getTxtHRoomCategorySearch`, payload, {
    params: queryParams
  }));

export const bookHotel = (payload) =>
  handleRequest(api.post(`bookings/saveRecord`, payload));


export const getSites = (token, payload) =>
  handleRequest(
    api.post(`get-sites`, payload, {
      headers: {
        Authorization: token,
      },
    })
  );