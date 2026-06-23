import { Navigate } from 'react-router-dom';
import Loader from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';
import { ROLE_DASHBOARD_PATHS } from '../utils/constants';

export default function RoleBasedRoute({ children, allowedRoles = [] }) {
  const { loading, isAuthenticated, userRole } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <Loader label="Loading access rules..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to={ROLE_DASHBOARD_PATHS[userRole] || '/login'} replace />;
  }

  return children;
}

