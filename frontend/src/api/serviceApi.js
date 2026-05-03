import api from './axiosInstance';

export const getServices = (city) =>
  api.get('/api/services', { params: { city } });
