import api from './axiosInstance';

export const createAppointment = (data) =>
  api.post('/api/appointments', data);

export const getPatientAppointments = () =>
  api.get('/api/appointments/patient');

export const getDoctorAppointments = () =>
  api.get('/api/appointments/doctor');

export const getDoctorRequests = () =>
  api.get('/api/appointments/doctor/requests');

export const updateAppointmentStatus = (id, status) =>
  api.put(`/api/appointments/${id}/status`, { status });

export const isSlotLocked = (doctorId, slotIso) =>
  api.get('/api/appointments/slot-locked', { params: { doctorId, slotIso } });
