import { useCurrentUserQuery } from 'api';
import type { UserType } from 'api/auth/types';
import type React from 'react';
import { Navigate } from 'react-router-dom';
import { hasAnyRole, isAuthenticated } from 'utils/permissions';
import { Loading } from '../common';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserType[];
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

/**
 * ProtectedRoute Component
 *
 * Protects routes based on user authentication and roles.
 *
 * @param children - The component to render if access is granted
 * @param allowedRoles - Array of roles that can access this route
 * @param requireAuth - Whether authentication is required (default: true)
 * @param redirectTo - Where to redirect if access is denied (default: '/login')
 * @param fallback - Custom fallback component if access is denied
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireAuth = true,
  redirectTo = '/login',
  fallback,
}) => {
  const { data: user, isLoading, isError } = useCurrentUserQuery();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <Loading />;
  }

  // Check if authentication is required
  if (requireAuth && (!isAuthenticated(user) || isError)) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check if user has required roles
  if (allowedRoles && allowedRoles.length > 0) {
    if (!hasAnyRole(user, allowedRoles)) {
      // If custom fallback is provided, show it
      if (fallback) {
        return <>{fallback}</>;
      }

      // Otherwise redirect to dashboard with unauthorized message
      return (
        <Navigate
          to="/dashboard"
          replace
          state={{ message: 'Bu səhifəyə giriş icazəniz yoxdur.' }}
        />
      );
    }
  }

  // User is authenticated and has required roles
  return <>{children}</>;
};

export default ProtectedRoute;
