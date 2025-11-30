export type EnrollmentStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'DROPPED' | 'SUSPENDED';

export interface Enrollment {
  id: number;
  student: number;
  student_name: string;
  course_group: number;
  course_group_name: string;
  course_name: string;
  teacher_name: string;
  status: EnrollmentStatus;
  monthly_price: string;
  enrollment_date: string;
  completion_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface EnrollmentCreate {
  student: number;
  course_group: number;
  status?: EnrollmentStatus;
  monthly_price: string;
  enrollment_date?: string;
  completion_date?: string;
  notes?: string | null;
}

export interface EnrollmentUpdate {
  status?: EnrollmentStatus;
  monthly_price?: string;
  enrollment_date?: string;
  completion_date?: string;
  notes?: string | null;
}

export interface EnrollmentListParams {
  course_group?: number;
  search?: string;
  status?: EnrollmentStatus;
  student?: number;
}
