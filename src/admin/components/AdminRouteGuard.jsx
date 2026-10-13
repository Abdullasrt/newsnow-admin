import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';

export const AdminRouteGuard = ({ children }) => {
  const { adminUser } = useNews();
  const location = useLocation();

  if (!adminUser) {
    // Redirect to login page, preserving the attempted path
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};
