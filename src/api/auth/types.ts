export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  // HTTP-only cookie authentication - no token in response
  // The API may return user info or just a success message
  message?: string;
  user?: User;
}

export type UserType =
  | 'NOT_SET'
  | 'STUDENT'
  | 'TEACHER'
  | 'BRANCH_MANAGER'
  | 'BRANCH_ADMIN'
  | 'ORGANIZATION_ADMIN';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  user_type: UserType;
  phone_number: string | null;
  date_of_birth: string | null;
  address: string | null;
  profile_picture: string | null;
  organization: number | null;
  branches: number[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CSRFTokenResponse {
  csrf_token: string;
}

export interface MessageResponse {
  message: string;
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface TokenVerify {
  token: string;
  email: string;
}

export interface ProfileUpdateRequest {
  first_name?: string;
  last_name?: string;
  phone_number?: string | null;
  date_of_birth?: string | null;
  address?: string | null;
  profile_picture?: File | string | null;
  user_type?: UserType;
  organization?: number | null;
  branches?: number[];
  is_active?: boolean;
}
