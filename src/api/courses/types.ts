export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type CourseGroupStatus = 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export interface CourseGroupSchedule {
  day: DayOfWeek;
  start_time: string;
  end_time: string;
}

export interface Course {
  id: number;
  name: string;
  code: string;
  description: string;
  level: CourseLevel;
  status: CourseStatus;
  duration_hours: number;
  groups_count: string;
  created_at: string;
  updated_at: string;
}

export interface CourseCreate {
  name: string;
  code: string;
  description: string;
  level: CourseLevel;
  status?: CourseStatus;
  duration_hours: number;
}

export interface CourseUpdate {
  name?: string;
  code?: string;
  description?: string;
  level?: CourseLevel;
  status?: CourseStatus;
  duration_hours?: number;
}

export interface CourseListParams {
  level?: CourseLevel;
  search?: string;
  status?: CourseStatus;
}

export interface CourseGroupTeacher {
  id: number;
  full_name: string;
}

export interface CourseGroup {
  id: number;
  course: number;
  course_name: string;
  branch: number;
  branch_name: string;
  name: string;
  code: string;
  teacher: CourseGroupTeacher[];
  max_students: number;
  monthly_price: string;
  schedule: CourseGroupSchedule[];
  days_of_week: string[];
  schedule_display: string;
  start_date: string;
  end_date: string;
  status: CourseGroupStatus;
  notes: string | null;
  is_full: boolean;
  enrolled_count: number;
  available_slots: number;
  students?: GroupEnrollment[];
  created_at: string;
  updated_at: string;
}

export interface CourseGroupCreate {
  branch: number;
  name: string;
  code: string;
  teacher_ids: number[];
  max_students: number;
  monthly_price: string;
  schedule: CourseGroupSchedule[];
  start_date: string;
  end_date: string;
  status?: CourseGroupStatus;
  notes?: string;
}

export interface CourseGroupUpdate {
  branch?: number;
  name?: string;
  code?: string;
  teacher_ids?: number[];
  max_students?: number;
  monthly_price?: string;
  schedule?: CourseGroupSchedule[];
  start_date?: string;
  end_date?: string;
  status?: CourseGroupStatus;
  notes?: string;
}

export interface CourseGroupListParams {
  branch?: number;
  search?: string;
  status?: CourseGroupStatus;
  teacher_ids?: string; // Comma-separated list like "1,2,3"
  page?: number;
  page_size?: number;
}

export interface MyGroupsResponse {
  role: string;
  groups: CourseGroup[];
}

export type GroupEnrollmentStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'DROPPED' | 'SUSPENDED';

export interface GroupEnrollment {
  id: number;
  student: number;
  student_name: string;
  status: GroupEnrollmentStatus;
  enrollment_date: string;
  completion_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
