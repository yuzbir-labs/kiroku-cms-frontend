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

export interface ScheduleItem {
  day: DayOfWeek;
  start_time: string;
  end_time: string;
}

export interface CourseGroup {
  id: number;
  course: number;
  course_name: string;
  name: string;
  code: string;
  teacher: number[];
  teacher_name: string;
  max_students: number;
  monthly_price: string;
  schedule: ScheduleItem[];
  days_of_week: unknown[];
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
  course: number;
  name: string;
  code: string;
  teacher: number[];
  max_students: number;
  monthly_price: string;
  schedule: ScheduleItem[];
  start_date: string;
  end_date: string;
  status?: CourseGroupStatus;
  notes?: string | null;
}

export interface CourseGroupUpdate {
  course?: number;
  name?: string;
  code?: string;
  teacher?: number[];
  max_students?: number;
  monthly_price?: string;
  schedule?: ScheduleItem[];
  start_date?: string;
  end_date?: string;
  status?: CourseGroupStatus;
  notes?: string | null;
}

export interface CourseGroupListParams {
  course?: number;
  search?: string;
  status?: CourseGroupStatus;
  teacher?: number[];
}
