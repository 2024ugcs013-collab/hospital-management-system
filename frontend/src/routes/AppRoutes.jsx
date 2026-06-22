import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import Home from '../pages/Home';
import PatientDashboard from '../pages/patient/Dashboard';
import DoctorDashboard from '../pages/doctor/Dashboard';
import ReceptionistDashboard from '../pages/receptionist/Dashboard';
import AdminDashboard from '../pages/admin/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';
import { USER_ROLES } from '../utils/constants';

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
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={[USER_ROLES.PATIENT]}>
                  <PatientDashboard />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
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
