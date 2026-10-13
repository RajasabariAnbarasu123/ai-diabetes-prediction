import axiosInstance from './axiosInstance';

const aiService = {
  chat: async (message) => {
    const { data } = await axiosInstance.post('/ai/chat', { message });
    return data;
  },
  getChatHistory: async () => {
    const { data } = await axiosInstance.get('/ai/chat/history');
    return data;
  },
  getDietPlan: async (params = {}) => {
    const { data } = await axiosInstance.get('/ai/diet', { params });
    return data;
  },
  getExercisePlan: async (params = {}) => {
    const { data } = await axiosInstance.get('/ai/exercise', { params });
    return data;
  },
  getDailyTip: async () => {
    const { data } = await axiosInstance.get('/ai/tip');
    return data;
  },
};

export default aiService;