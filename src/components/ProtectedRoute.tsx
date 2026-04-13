import React from 'react';
import { Navigate } from 'react-router-dom';

import { ProtectedRouteProps } from '../interfaces';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Hardcoded to 'true' for now so you can test your pages
  const isAuthenticated = true; 

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;