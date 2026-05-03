import api from './axiosInstance';

export const upsertPrescription = (data) =>
  api.post('/api/prescriptions', data);

export const getPatientPrescriptions = (patientId) =>
  api.get(`/api/prescriptions/patient/${patientId}`);

export const getDoctorPrescriptions = (doctorId) =>
  api.get(`/api/prescriptions/doctor/${doctorId}`);

export const getPrescriptionById = (id) =>
  api.get(`/api/prescriptions/${id}`);

export const getPrescriptionByAppointment = (appointmentId) =>
  api.get(`/api/prescriptions/appointment/${appointmentId}`);

export const downloadPrescriptionPdf = async (id) => {
  const res = await api.get(`/api/prescriptions/${id}/pdf`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const a = document.createElement('a');
  a.href = url;
  a.download = `prescription-${id}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
};
