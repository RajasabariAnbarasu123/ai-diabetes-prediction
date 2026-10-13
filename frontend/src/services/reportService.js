import axiosInstance from './axiosInstance';

const reportService = {
  uploadReport: async (formData) => {
    const { data } = await axiosInstance.post('/reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  getReports: async ({ page = 0, size = 10 } = {}) => {
    const { data } = await axiosInstance.get('/reports', { params: { page, size } });
    return data;
  },
};

export default reportService;