import React from 'react';
import { useCurrentUserQuery } from '../../api';
import { hasAnyRole, hasAllRoles } from '../../utils/permissions';
import type { UserType } from '../../api/auth/types';

interface RoleGuardProps {
  children: React.ReactNode;
  roles: UserType[];
  fallback?: React.ReactNode;
  requireAll?: boolean;
  inverse?: boolean;
}

/**
 * RoleGuard Component
 *
 * Conditionally renders children based on user roles.
 * Use this for showing/hiding UI elements based on permissions.
 *
 * @param children - The component to render if role check passes
 * @param roles - Array of roles to check
 * @param fallback - Component to render if role check fails (default: null)
 * @param requireAll - Whether user must have ALL roles (default: false - any role is sufficient)
 * @param inverse - Invert the logic (show if user DOESN'T have the roles)
 *
 * @example
 * // Show button only for Organization Admin
 * <RoleGuard roles={['ORGANIZATION_ADMIN']}>
 *   <button>Create Course</button>
 * </RoleGuard>
 *
 * @example
 * // Show for multiple roles
 * <RoleGuard roles={['ORGANIZATION_ADMIN', 'BRANCH_ADMIN']}>
 *   <button>Manage Users</button>
 * </RoleGuard>
 *
 * @example
 * // Show different content if user doesn't have access
 * <RoleGuard
 *   roles={['TEACHER']}
 *   fallback={<p>You need teacher access</p>}
 * >
 *   <button>Mark Attendance</button>
 * </RoleGuard>
 */
const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  roles,
  fallback = null,
  requireAll = false,
  inverse = false,
}) => {
  const { data: user } = useCurrentUserQuery();

  if (!user) {
    return <>{fallback}</>;
  }

  let hasAccess: boolean;

  if (requireAll) {
    hasAccess = hasAllRoles(user, roles);
  } else {
    hasAccess = hasAnyRole(user, roles);
  }

  // Invert logic if inverse is true
  if (inverse) {
    hasAccess = !hasAccess;
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default RoleGuard;
