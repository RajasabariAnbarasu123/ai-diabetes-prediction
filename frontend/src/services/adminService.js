import axiosInstance from './axiosInstance';

const adminService = {
  getStats: async () => {
    const { data } = await axiosInstance.get('/admin/stats');
    return data;
  },
  getUsers: async (params = {}) => {
    const { data } = await axiosInstance.get('/admin/users', { params });
    return data;
  },
  getPredictions: async (params = {}) => {
    const { data } = await axiosInstance.get('/admin/predictions', { params });
    return data;
  },
  getReports: async (params = {}) => {
    const { data } = await axiosInstance.get('/admin/reports', { params });
    return data;
  },
  getActivityLogs: async (params = {}) => {
    const { data } = await axiosInstance.get('/admin/activity-logs', { params });
    return data;
  },
  disableUser: async (userId) => {
    await axiosInstance.patch(`/admin/users/${userId}/disable`);
  },
  enableUser: async (userId) => {
    await axiosInstance.patch(`/admin/users/${userId}/enable`);
  },
  deleteUser: async (userId) => {
    await axiosInstance.delete(`/admin/users/${userId}`);
  },
};

export default adminService;