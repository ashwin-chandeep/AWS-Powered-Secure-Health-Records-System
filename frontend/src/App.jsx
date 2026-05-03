import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import AuthGuard from './components/guards/AuthGuard';
import RoleGuard from './components/guards/RoleGuard';
import CityGuard from './components/guards/CityGuard';
import AppLayout from './components/layout/AppLayout';

import HomeRedirect from './pages/HomeRedirect';
import Login from './pages/auth/Login';
import RegisterPatient from './pages/auth/RegisterPatient';
import RegisterDoctor from './pages/auth/RegisterDoctor';
import SelectCity from './pages/city/SelectCity';

import SearchDoctors from './pages/patient/SearchDoctors';
import BookAppointment from './pages/patient/BookAppointment';
import PatientAppointments from './pages/patient/PatientAppointments';
import PatientMedicalHistory from './pages/patient/PatientMedicalHistory';
import PatientPrescriptions from './pages/patient/PatientPrescriptions';
import PatientPrescriptionView from './pages/patient/PatientPrescriptionView';
import PatientPayments from './pages/patient/PatientPayments';
import PatientNotifications from './pages/patient/PatientNotifications';
import PatientProfile from './pages/patient/PatientProfile';
import PatientAccessRequests from './pages/patient/PatientAccessRequests';

import DoctorToday from './pages/doctor/DoctorToday';
import DoctorRequests from './pages/doctor/DoctorRequests';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import PrescriptionCreate from './pages/doctor/PrescriptionCreate';
import DoctorPatientRecords from './pages/doctor/DoctorPatientRecords';
import DoctorAccessRequests from './pages/doctor/DoctorAccessRequests';
import DoctorPatientHistoryView from './pages/doctor/DoctorPatientHistoryView';
import DoctorEarnings from './pages/doctor/DoctorEarnings';
import DoctorProfile from './pages/doctor/DoctorProfile';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        className: '!bg-white !dark:bg-slate-800 !text-slate-900 !dark:text-white !rounded-xl !shadow-card',
        duration: 3500,
      }} />

      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/patient" element={<RegisterPatient />} />
        <Route path="/register/doctor" element={<RegisterDoctor />} />

        <Route path="/select-city" element={<AuthGuard><SelectCity /></AuthGuard>} />

        {/* Patient Routes */}
        <Route path="/patient" element={<AuthGuard><RoleGuard role="PATIENT"><CityGuard><AppLayout role="PATIENT" /></CityGuard></RoleGuard></AuthGuard>}>
          <Route path="search-doctors" element={<SearchDoctors />} />
          <Route path="book/:doctorId" element={<BookAppointment />} />
          <Route path="appointments" element={<PatientAppointments />} />
          <Route path="medical-history" element={<PatientMedicalHistory />} />
          <Route path="prescriptions" element={<PatientPrescriptions />} />
          <Route path="prescriptions/:id" element={<PatientPrescriptionView />} />
          <Route path="payments" element={<PatientPayments />} />
          <Route path="notifications" element={<PatientNotifications />} />
          <Route path="privacy" element={<PatientAccessRequests />} />
          <Route path="profile" element={<PatientProfile />} />
        </Route>

        {/* Doctor Routes */}
        <Route path="/doctor" element={<AuthGuard><RoleGuard role="DOCTOR"><AppLayout role="DOCTOR" /></RoleGuard></AuthGuard>}>
          <Route path="today" element={<DoctorToday />} />
          <Route path="requests" element={<DoctorRequests />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="prescriptions/create/:appointmentId" element={<PrescriptionCreate />} />
          <Route path="records" element={<DoctorPatientRecords />} />
          <Route path="prescriptions/:id" element={<PatientPrescriptionView />} />
          <Route path="access-requests" element={<DoctorAccessRequests />} />
          <Route path="patient-history/:patientId" element={<DoctorPatientHistoryView />} />
          <Route path="earnings" element={<DoctorEarnings />} />
          <Route path="notifications" element={<PatientNotifications />} />
          <Route path="profile" element={<DoctorProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
