import api from './axiosInstance';

export const initiatePayment = (data) =>
  api.post('/api/payments/initiate', data);

export const completePayment = (id, paymentMethod) =>
  api.put(`/api/payments/${id}/complete`, { paymentMethod });

export const getPatientPayments = () =>
  api.get('/api/payments/patient');

export const getDoctorPayments = () =>
  api.get('/api/payments/doctor');

export const getPaymentByAppointment = (appointmentId) =>
  api.get(`/api/payments/appointment/${appointmentId}`);
