import type React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  element: React.ComponentType;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element: Element }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? <Element /> : <Navigate to="/login" />;
};

export default PrivateRoute;