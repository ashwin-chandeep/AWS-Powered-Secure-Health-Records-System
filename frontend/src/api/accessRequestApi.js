import api from './axiosInstance';

export const createAccessRequest = (data) =>
  api.post('/api/access-requests', data);

export const getDoctorAccessRequests = () =>
  api.get('/api/access-requests/doctor');

export const getPatientAccessRequests = () =>
  api.get('/api/access-requests/patient');

export const approveAccessRequest = (id, scope) =>
  api.put(`/api/access-requests/${id}/approve`, { scope });

export const rejectAccessRequest = (id) =>
  api.put(`/api/access-requests/${id}/reject`);

export const hasAccess = (doctorId, patientId) =>
  api.get('/api/access-requests/has-access', { params: { doctorId, patientId } });
