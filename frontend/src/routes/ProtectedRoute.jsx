import { Navigate } from 'react-router-dom';
import Loader from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { ready, isAuthenticated } = useAuth();

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <Loader label="Checking session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

