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
  branches: number[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type UserType =
  | 'NOT_SET'
  | 'STUDENT'
  | 'PARENT'
  | 'TEACHER'
  | 'BRANCH_MANAGER'
  | 'BRANCH_ADMIN'
  | 'ORGANIZATION_ADMIN';

export interface CSRFTokenResponse {
  csrf_token: string;
}

export interface MessageResponse {
  message: string;
}
