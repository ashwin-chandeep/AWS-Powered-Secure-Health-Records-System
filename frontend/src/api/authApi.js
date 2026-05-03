import api from './axiosInstance';

export const login = (identifier, password) =>
  api.post('/api/auth/login', { identifier, password });

export const registerPatient = (data) =>
  api.post('/api/auth/register/patient', data);

export const registerDoctor = (data) =>
  api.post('/api/auth/register/doctor', data);

export const getMe = () =>
  api.get('/api/auth/me');

export const getUsersByRole = (role) =>
  api.get('/api/auth/users', { params: { role } });
