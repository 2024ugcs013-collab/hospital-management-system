import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import Home from '../pages/Home';
import PatientDashboard from '../pages/patient/Dashboard';
import PatientBookAppointment from '../pages/patient/BookAppointment';
import PatientAppointments from '../pages/patient/AppointmentHistory';
import PatientMedicalRecords from '../pages/patient/MedicalRecords';
import PatientPrescriptions from '../pages/patient/Prescriptions';
import PatientBills from '../pages/patient/Bills';
import PatientNotifications from '../pages/patient/Notifications';
import PatientProfile from '../pages/patient/Profile';
import DoctorDashboard from '../pages/doctor/Dashboard';
import ReceptionistDashboard from '../pages/receptionist/Dashboard';
import AdminDashboard from '../pages/admin/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';
import { USER_ROLES } from '../utils/constants';

function PatientOnly({ children }) {
  return (
    <ProtectedRoute>
      <RoleBasedRoute allowedRoles={[USER_ROLES.PATIENT]}>{children}</RoleBasedRoute>
    </ProtectedRoute>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route
            path="/patient/dashboard"
            element={<PatientOnly><PatientDashboard /></PatientOnly>}
          />
          <Route path="/patient/book-appointment" element={<PatientOnly><PatientBookAppointment /></PatientOnly>} />
          <Route path="/patient/appointments" element={<PatientOnly><PatientAppointments /></PatientOnly>} />
          <Route path="/patient/medical-records" element={<PatientOnly><PatientMedicalRecords /></PatientOnly>} />
          <Route path="/patient/prescriptions" element={<PatientOnly><PatientPrescriptions /></PatientOnly>} />
          <Route path="/patient/bills" element={<PatientOnly><PatientBills /></PatientOnly>} />
          <Route path="/patient/notifications" element={<PatientOnly><PatientNotifications /></PatientOnly>} />
          <Route path="/patient/profile" element={<PatientOnly><PatientProfile /></PatientOnly>} />
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={[USER_ROLES.DOCTOR]}>
                  <DoctorDashboard />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/dashboard"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={[USER_ROLES.RECEPTIONIST]}>
                  <ReceptionistDashboard />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                  <AdminDashboard />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
