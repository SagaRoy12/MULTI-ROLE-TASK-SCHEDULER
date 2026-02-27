import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const getRefreshEndpoint = () => {
  const role = localStorage.getItem("role");
  return role === "admin" 
    ? "/api/v1/admin_route/refresh_token" 
    : "/api/v1/user_route/refresh_token";
};

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

// Response interceptor for error handling and token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axiosInstance.post(getRefreshEndpoint());
        const { role } = response.data;
        
        // Store new token (though it's also in cookies now)
        if (role === "admin") {
          localStorage.setItem("adminToken", response.data.newAccessToken || "");
        } else {
          localStorage.setItem("userToken", response.data.newAccessToken || "");
        }

        processQueue(null, response.data.newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${response.data.newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Clear tokens and redirect to login
        localStorage.removeItem("adminToken");
        localStorage.removeItem("userToken");
        localStorage.removeItem("role");
        
        const role = localStorage.getItem("role");
        window.location.href = role === "admin" ? "/admin/login" : "/login";
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response) {
      const { status, data } = error.response;
      console.error(`API Error ${status}:`, data.message || 'Unknown error');
    } else if (error.request) {
      console.error('Network Error: No response received');
    } else {
      console.error('Request Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;