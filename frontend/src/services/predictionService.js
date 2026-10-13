import axiosInstance from './axiosInstance';

const predictionService = {
  createPrediction: async (predictionData) => {
    const { data } = await axiosInstance.post('/predictions', predictionData);
    return data;
  },
  getPredictions: async ({ page = 0, size = 10, sort = 'createdAt,desc', search = '' } = {}) => {
    const { data } = await axiosInstance.get('/predictions', {
      params: { page, size, sort, search },
    });
    return data;
  },
  comparePredictions: async (ids) => {
    const [id1, id2] = ids;
    const { data } = await axiosInstance.post('/predictions/compare', null, {
      params: { id1, id2 },
    });
    return data;
  },
  deletePrediction: async (id) => {
    await axiosInstance.delete(`/predictions/${id}`);
  },
};


export default predictionService;