import { Navigate } from 'react-router-dom';

export default function RoleBasedRoute({ children, allowedRoles = [], userRole }) {
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
