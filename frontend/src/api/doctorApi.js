import api from './axiosInstance';

export const getDoctors = (city) =>
  api.get('/api/doctors', { params: { city } });

export const getDoctorById = (id) =>
  api.get(`/api/doctors/${id}`);

export const getSpecializations = (city) =>
  api.get('/api/doctors/specializations', { params: { city } });
