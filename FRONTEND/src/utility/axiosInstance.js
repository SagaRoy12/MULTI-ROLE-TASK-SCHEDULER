import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
  withCredentials: true,
});

// Request interceptor — attach correct token based on role
axiosInstance.interceptors.request.use((config) => {
  const role = localStorage.getItem("role");
  const token = role === "admin"
    ? localStorage.getItem("adminToken")
    : localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      console.error(`API Error ${status}:`, data.message || 'Unknown error');

      switch (status) {
        case 400:
          console.error('Bad Request');
          break;
        case 401:
          console.error('Unauthorized');
          break;
        case 404:
          console.error('Not Found');
          break;
        case 409:
          console.error('Conflict');
          break;
        case 500:
          console.error('Internal Server Error');
          break;
        default:
          console.error('Request failed');
      }
    } else if (error.request) {
      // Network error
      console.error('Network Error: No response received');
    } else {
      // Request setup error
      console.error('Request Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;