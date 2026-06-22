import { Navigate } from 'react-router-dom';
import Loader from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';
import { getDashboardPath } from '../utils/helpers';

export default function RoleBasedRoute({ children, allowedRoles = [] }) {
  const { ready, isAuthenticated, userRole } = useAuth();

  if (!ready) {
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
    return <Navigate to={getDashboardPath(userRole)} replace />;
  }

  return children;
}

