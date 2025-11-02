export interface Organization {
  id: number;
  name: string;
  code: string;
  description: string | null;
  email: string | null;
  phone_number: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  logo: string | null;
  is_active: boolean;
  branch_count: number;
  total_students: number;
  created_at: string;
  updated_at: string;
}

export interface OrganizationCreate {
  name: string;
  code: string;
  description?: string | null;
  email?: string | null;
  phone_number?: string | null;
  website?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  logo?: string | null;
  is_active?: boolean;
}

export interface OrganizationUpdate {
  name?: string;
  code?: string;
  description?: string | null;
  email?: string | null;
  phone_number?: string | null;
  website?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  logo?: string | null;
  is_active?: boolean;
}

export interface OrganizationListParams {
  city?: string;
  country?: string;
  is_active?: boolean;
  search?: string;
  state?: string;
}

export interface OrganizationStatistics {
  organization_id: number;
  organization_name: string;
  total_branches: number;
  total_students: number;
  total_teachers: number;
  total_courses: number;
}

export interface OrganizationBranch {
  id: number;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string | null;
  country: string;
  postal_code: string | null;
  phone_number: string;
  email: string;
  is_active: boolean;
}
