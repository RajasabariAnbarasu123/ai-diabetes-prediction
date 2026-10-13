import axios from 'axios';
import API_BASE_URL from '../config/constants';

let store;
export const injectStore = (_store) => {
  store = _store;
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor – attach access token
axiosInstance.interceptors.request.use(
  (config) => {
    if (store && store.getState) {
      const { auth } = store.getState();
      if (auth && auth.accessToken) {
        config.headers.Authorization = `Bearer ${auth.accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – handle 401 and token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
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
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      if (!store || !store.getState) {
        return Promise.reject(error);
      }

      const { auth } = store.getState();
      if (!auth || !auth.refreshToken) {
        store.dispatch({ type: 'auth/forceLogout' });
        return Promise.reject(error);
      }

      try {
        // Direct axios post call to refresh token endpoint to avoid circular dependencies
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken: auth.refreshToken,
        });
        const result = response.data;
        const newToken = result.accessToken;

        // Update the token state in the Redux store
        store.dispatch({
          type: 'auth/setTokens',
          payload: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          },
        });

        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Call backend logout endpoint directly to notify server
        try {
          if (auth.accessToken) {
            await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
              headers: { Authorization: `Bearer ${auth.accessToken}` }
            });
          }
        } catch (e) {
          // ignore logout errors
        }

        store.dispatch({ type: 'auth/forceLogout' });
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;