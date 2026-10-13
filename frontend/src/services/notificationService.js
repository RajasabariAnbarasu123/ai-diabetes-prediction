import axiosInstance from './axiosInstance';

const notificationService = {
  getNotifications: async () => {
    const { data } = await axiosInstance.get('/notifications');
    return data;
  },
  markRead: async (id) => {
    await axiosInstance.patch(`/notifications/${id}/read`);
  },
};

export default notificationService;