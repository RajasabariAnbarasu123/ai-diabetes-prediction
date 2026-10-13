import axiosInstance from './axiosInstance';

const medicationService = {
  getMedications: async () => {
    const { data } = await axiosInstance.get('/medications');
    return data;
  },
  createMedication: async (medication) => {
    const { data } = await axiosInstance.post('/medications', medication);
    return data;
  },
  updateMedication: async (id, medication) => {
    const { data } = await axiosInstance.put(`/medications/${id}`, medication);
    return data;
  },
  deleteMedication: async (id) => {
    await axiosInstance.delete(`/medications/${id}`);
  },
};

export default medicationService;