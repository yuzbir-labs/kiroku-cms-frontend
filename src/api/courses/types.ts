export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type CourseGroupStatus =
  | 'UPCOMING'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED';

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
  created_at: string;
  updated_at: string;
}

export interface CourseGroupCreate {
  branch: number;
  name: string;
  code: string;
  teacher: number[];
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
  teacher?: number[];
  max_students?: number;
  monthly_price?: string;
  schedule?: CourseGroupSchedule[];
  start_date?: string;
  end_date?: string;
  status?: CourseGroupStatus;
  notes?: string;
}

export interface MyGroupsResponse {
  role: string;
  groups: CourseGroup[];
}
