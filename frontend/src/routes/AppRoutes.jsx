import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminLayout from '../layouts/AdminLayout';
import Login from '../pages/auth/Login';
import Dashboard from '../pages/patient/Dashboard';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
