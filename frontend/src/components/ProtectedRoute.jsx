// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../utils/auth';

export default function ProtectedRoute({ children, requiredRole }) {
  const isAuth = isAuthenticated();
  const userRole = getUserRole();

  if (!isAuth) return <Navigate to="/login" />;
  if (requiredRole && userRole !== requiredRole) return <Navigate to="/login" />;

  return children;
}
