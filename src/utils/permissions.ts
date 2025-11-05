import type { User, UserType } from '../api/auth/types';

/**
 * User Role Constants
 */
export const UserRoles = {
  ORGANIZATION_ADMIN: 'ORGANIZATION_ADMIN' as UserType,
  BRANCH_ADMIN: 'BRANCH_ADMIN' as UserType,
  BRANCH_MANAGER: 'BRANCH_MANAGER' as UserType,
  TEACHER: 'TEACHER' as UserType,
  STUDENT: 'STUDENT' as UserType,
  PARENT: 'PARENT' as UserType,
  NOT_SET: 'NOT_SET' as UserType,
} as const;

/**
 * Check if user has a specific role
 */
export const hasRole = (
  user: User | null | undefined,
  role: UserType
): boolean => {
  if (!user) return false;
  return user.user_type === role;
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (
  user: User | null | undefined,
  roles: UserType[]
): boolean => {
  if (!user) return false;
  return roles.includes(user.user_type);
};

/**
 * Check if user has all of the specified roles
 */
export const hasAllRoles = (
  user: User | null | undefined,
  roles: UserType[]
): boolean => {
  if (!user) return false;
  return roles.every((role) => hasRole(user, role));
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (user: User | null | undefined): boolean => {
  return !!user;
};

/**
 * Check if user can manage organization
 * Only Organization Admin
 */
export const canManageOrganization = (
  user: User | null | undefined
): boolean => {
  return hasRole(user, UserRoles.ORGANIZATION_ADMIN);
};

/**
 * Check if user can create courses
 * Organization Admin, Branch Admin, Branch Manager
 */
export const canCreateCourses = (user: User | null | undefined): boolean => {
  return hasAnyRole(user, [
    UserRoles.ORGANIZATION_ADMIN,
    UserRoles.BRANCH_ADMIN,
    UserRoles.BRANCH_MANAGER,
  ]);
};

/**
 * Check if user can update courses
 * Organization Admin, Branch Admin, Branch Manager
 */
export const canUpdateCourses = (user: User | null | undefined): boolean => {
  return hasAnyRole(user, [
    UserRoles.ORGANIZATION_ADMIN,
    UserRoles.BRANCH_ADMIN,
    UserRoles.BRANCH_MANAGER,
  ]);
};

/**
 * Check if user can delete courses
 * Organization Admin, Branch Admin, Branch Manager
 */
export const canDeleteCourses = (user: User | null | undefined): boolean => {
  return hasAnyRole(user, [
    UserRoles.ORGANIZATION_ADMIN,
    UserRoles.BRANCH_ADMIN,
    UserRoles.BRANCH_MANAGER,
  ]);
};

/**
 * Check if user can view courses
 * All authenticated users except students can view courses
 */
export const canViewCourses = (user: User | null | undefined): boolean => {
  if (!user) return false;
  return (
    user.user_type !== UserRoles.STUDENT && user.user_type !== UserRoles.PARENT
  );
};

/**
 * Check if user can create branches
 * Only Organization Admin
 */
export const canCreateBranches = (user: User | null | undefined): boolean => {
  return hasRole(user, UserRoles.ORGANIZATION_ADMIN);
};

/**
 * Check if user can update branches
 * Organization Admin, Branch Admin, Branch Manager
 */
export const canUpdateBranches = (user: User | null | undefined): boolean => {
  return hasAnyRole(user, [
    UserRoles.ORGANIZATION_ADMIN,
    UserRoles.BRANCH_ADMIN,
    UserRoles.BRANCH_MANAGER,
  ]);
};

/**
 * Check if user can delete branches
 * Only Organization Admin
 */
export const canDeleteBranches = (user: User | null | undefined): boolean => {
  return hasRole(user, UserRoles.ORGANIZATION_ADMIN);
};

/**
 * Check if user can view branches
 * Organization Admin, Branch Admin, Branch Manager
 */
export const canViewBranches = (user: User | null | undefined): boolean => {
  return hasAnyRole(user, [
    UserRoles.ORGANIZATION_ADMIN,
    UserRoles.BRANCH_ADMIN,
    UserRoles.BRANCH_MANAGER,
  ]);
};

/**
 * Check if user can manage users (view, create, update, delete)
 * Organization Admin, Branch Admin, Branch Manager
 */
export const canManageUsers = (user: User | null | undefined): boolean => {
  return hasAnyRole(user, [
    UserRoles.ORGANIZATION_ADMIN,
    UserRoles.BRANCH_ADMIN,
    UserRoles.BRANCH_MANAGER,
  ]);
};

/**
 * Check if user can mark attendance
 * Organization Admin, Branch Admin, Branch Manager, Teacher
 */
export const canMarkAttendance = (user: User | null | undefined): boolean => {
  return hasAnyRole(user, [
    UserRoles.ORGANIZATION_ADMIN,
    UserRoles.BRANCH_ADMIN,
    UserRoles.BRANCH_MANAGER,
    UserRoles.TEACHER,
  ]);
};

/**
 * Check if user can view attendance
 * Teachers and Students can view attendance
 */
export const canViewAttendance = (user: User | null | undefined): boolean => {
  return hasAnyRole(user, [
    UserRoles.ORGANIZATION_ADMIN,
    UserRoles.BRANCH_ADMIN,
    UserRoles.BRANCH_MANAGER,
    UserRoles.TEACHER,
    UserRoles.STUDENT,
  ]);
};

/**
 * Check if user can create enrollments
 * Only Organization Admin, Branch Admin, and Branch Manager
 */
export const canCreateEnrollments = (
  user: User | null | undefined
): boolean => {
  return hasAnyRole(user, [
    UserRoles.ORGANIZATION_ADMIN,
    UserRoles.BRANCH_ADMIN,
    UserRoles.BRANCH_MANAGER,
  ]);
};

/**
 * Check if user can update enrollments
 * Only Organization Admin, Branch Admin, and Branch Manager
 */
export const canUpdateEnrollments = (
  user: User | null | undefined
): boolean => {
  return hasAnyRole(user, [
    UserRoles.ORGANIZATION_ADMIN,
    UserRoles.BRANCH_ADMIN,
    UserRoles.BRANCH_MANAGER,
  ]);
};

/**
 * Check if user can delete enrollments
 * Only Organization Admin, Branch Admin, and Branch Manager
 */
export const canDeleteEnrollments = (
  user: User | null | undefined
): boolean => {
  return hasAnyRole(user, [
    UserRoles.ORGANIZATION_ADMIN,
    UserRoles.BRANCH_ADMIN,
    UserRoles.BRANCH_MANAGER,
  ]);
};

/**
 * Check if user can view enrollments
 * Only Organization Admin, Branch Admin, and Branch Manager can view enrollments
 */
export const canViewEnrollments = (user: User | null | undefined): boolean => {
  return hasAnyRole(user, [
    UserRoles.ORGANIZATION_ADMIN,
    UserRoles.BRANCH_ADMIN,
    UserRoles.BRANCH_MANAGER,
  ]);
};

/**
 * Check if user can manage inquiries
 * Organization Admin, Branch Admin, Branch Manager
 */
export const canManageInquiries = (user: User | null | undefined): boolean => {
  return hasAnyRole(user, [
    UserRoles.ORGANIZATION_ADMIN,
    UserRoles.BRANCH_ADMIN,
    UserRoles.BRANCH_MANAGER,
  ]);
};

/**
 * Check if user can view inquiries
 * Organization Admin, Branch Admin, Branch Manager
 */
export const canViewInquiries = (user: User | null | undefined): boolean => {
  return hasAnyRole(user, [
    UserRoles.ORGANIZATION_ADMIN,
    UserRoles.BRANCH_ADMIN,
    UserRoles.BRANCH_MANAGER,
  ]);
};

/**
 * Get editable profile fields for a user based on their role
 */
export const getEditableProfileFields = (
  user: User | null | undefined
): string[] => {
  if (!user) return [];

  // Organization Admin can edit everything
  if (user.user_type === UserRoles.ORGANIZATION_ADMIN) {
    return [
      'first_name',
      'last_name',
      'phone_number',
      'date_of_birth',
      'address',
      'profile_picture',
      'user_type',
      'organization',
      'branches',
      'is_active',
    ];
  }

  // Student can only edit limited fields
  if (user.user_type === UserRoles.STUDENT) {
    return ['address', 'profile_picture', 'date_of_birth'];
  }

  // Teacher and Parent can edit personal info
  if (hasAnyRole(user, [UserRoles.TEACHER, UserRoles.PARENT])) {
    return [
      'first_name',
      'last_name',
      'phone_number',
      'date_of_birth',
      'address',
      'profile_picture',
    ];
  }

  // Branch Admin and Branch Manager can edit personal info
  if (hasAnyRole(user, [UserRoles.BRANCH_ADMIN, UserRoles.BRANCH_MANAGER])) {
    return [
      'first_name',
      'last_name',
      'phone_number',
      'date_of_birth',
      'address',
      'profile_picture',
    ];
  }

  return [];
};

/**
 * Check if user can create a specific user type
 */
export const canCreateUserType = (
  currentUser: User | null | undefined,
  targetUserType: UserType
): boolean => {
  if (!currentUser) return false;

  // Organization Admin can create any user except Organization Admin
  if (currentUser.user_type === UserRoles.ORGANIZATION_ADMIN) {
    return targetUserType !== UserRoles.ORGANIZATION_ADMIN;
  }

  // Branch Admin and Branch Manager can only create students, teachers, parents
  if (
    hasAnyRole(currentUser, [UserRoles.BRANCH_ADMIN, UserRoles.BRANCH_MANAGER])
  ) {
    return [UserRoles.STUDENT, UserRoles.TEACHER, UserRoles.PARENT].includes(
      targetUserType
    );
  }

  return false;
};

/**
 * Get user role display name
 */
export const getUserRoleLabel = (userType: UserType | undefined): string => {
  const roleLabels: Record<UserType, string> = {
    NOT_SET: 'Təyin edilməyib',
    STUDENT: 'Tələbə',
    PARENT: 'Valideyn',
    TEACHER: 'Müəllim',
    BRANCH_MANAGER: 'Filial Meneceri',
    BRANCH_ADMIN: 'Filial Admini',
    ORGANIZATION_ADMIN: 'Təşkilat Admini',
  };

  return userType ? roleLabels[userType] : 'Naməlum';
};

/**
 * Get role hierarchy level (higher number = more permissions)
 */
export const getRoleLevel = (userType: UserType | undefined): number => {
  const roleLevels: Record<UserType, number> = {
    ORGANIZATION_ADMIN: 80,
    BRANCH_ADMIN: 60,
    BRANCH_MANAGER: 50,
    TEACHER: 30,
    STUDENT: 10,
    PARENT: 10,
    NOT_SET: 0,
  };

  return userType ? roleLevels[userType] : 0;
};

/**
 * Check if currentUser can manage targetUser based on role hierarchy
 */
export const canManageUser = (
  currentUser: User | null | undefined,
  targetUser: User | null | undefined
): boolean => {
  if (!currentUser || !targetUser) return false;

  const currentLevel = getRoleLevel(currentUser.user_type);
  const targetLevel = getRoleLevel(targetUser.user_type);

  return currentLevel > targetLevel;
};

/**
 * Check if user can access dashboard statistics
 */
export const canViewDashboardStats = (
  user: User | null | undefined
): boolean => {
  return hasAnyRole(user, [
    UserRoles.ORGANIZATION_ADMIN,
    UserRoles.BRANCH_ADMIN,
    UserRoles.BRANCH_MANAGER,
  ]);
};

/**
 * Check if user can view dashboard page
 * All except students can view dashboard
 */
export const canViewDashboard = (user: User | null | undefined): boolean => {
  if (!user) return false;
  return (
    user.user_type !== UserRoles.STUDENT && user.user_type !== UserRoles.PARENT
  );
};

/**
 * Check if field is editable by user
 */
export const canEditField = (
  user: User | null | undefined,
  fieldName: string
): boolean => {
  const editableFields = getEditableProfileFields(user);
  return editableFields.includes(fieldName);
};

/**
 * Check if user can view course groups (management page)
 * Organization Admin, Branch Admin, Branch Manager only
 * Teachers use "My Groups" instead
 */
export const canViewCourseGroups = (user: User | null | undefined): boolean => {
  return hasAnyRole(user, [
    UserRoles.ORGANIZATION_ADMIN,
    UserRoles.BRANCH_ADMIN,
    UserRoles.BRANCH_MANAGER,
  ]);
};

/**
 * Check if user can manage course groups (create, update, delete)
 * Organization Admin, Branch Admin, Branch Manager
 */
export const canManageCourseGroups = (
  user: User | null | undefined
): boolean => {
  return hasAnyRole(user, [
    UserRoles.ORGANIZATION_ADMIN,
    UserRoles.BRANCH_ADMIN,
    UserRoles.BRANCH_MANAGER,
  ]);
};

/**
 * Check if user can view my groups page
 * Teachers and Students
 */
export const canViewMyGroups = (user: User | null | undefined): boolean => {
  return hasAnyRole(user, [UserRoles.TEACHER, UserRoles.STUDENT]);
};
