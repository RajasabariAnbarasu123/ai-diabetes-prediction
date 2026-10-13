import axiosInstance from './axiosInstance';

const profileService = {
  getProfile: async () => {
    const { data } = await axiosInstance.get('/profile');
    return data;
  },
  updateProfile: async (profileData) => {
    const { data } = await axiosInstance.put('/profile', profileData);
    return data;
  },
};

export default profileService;