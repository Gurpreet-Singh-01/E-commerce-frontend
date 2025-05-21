import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loader from './Loader';

const AdminRoute = ({ children }) => {
  const { user, isAdmin, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Loader
        size="large"
        className="min-h-screen flex items-center justify-center"
      />
    );
  }

  if (!user || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;