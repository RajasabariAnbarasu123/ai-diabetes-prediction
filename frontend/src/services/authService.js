import axiosInstance from './axiosInstance';

const authService = {
  login: async (credentials) => {
    const { data } = await axiosInstance.post('/auth/login', credentials);
    return data;
  },
  register: async (userData) => {
    const { data } = await axiosInstance.post('/auth/register', userData);
    return data;
  },
  refreshToken: async (refreshToken) => {
    const { data } = await axiosInstance.post('/auth/refresh', { refreshToken });
    return data;
  },
  logout: async (refreshToken) => {
    await axiosInstance.post('/auth/logout', { refreshToken });
  },
  verifyEmail: async (token) => {
    const { data } = await axiosInstance.get(`/auth/verify-email?token=${token}`);
    return data;
  },
  forgotPassword: async (email) => {
    const { data } = await axiosInstance.post('/auth/forgot-password', { email });
    return data;
  },
  resetPassword: async ({ token, newPassword }) => {
    const { data } = await axiosInstance.post('/auth/reset-password', { token, newPassword });
    return data;
  },
  changePassword: async ({ currentPassword, newPassword }) => {
    const { data } = await axiosInstance.post('/profile/change-password', { currentPassword, newPassword });
    return data;
  },
  updateProfile: async (profileData) => {
    const { data } = await axiosInstance.put('/profile', profileData);
    return data;
  },
};

export default authService;