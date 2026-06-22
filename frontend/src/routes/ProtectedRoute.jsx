import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, isAllowed = true }) {
  if (!isAllowed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
