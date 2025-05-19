import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import Loader from './Loader';
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if(isLoading){
    return <Loader size="large" className="min-h-screen flex items-center justify-center"/>
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
