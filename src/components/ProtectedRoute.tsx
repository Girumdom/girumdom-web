import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/authContext';

export const ProtectedRoute = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>; // Simple loading state

  // If no token, kick them back to Login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};