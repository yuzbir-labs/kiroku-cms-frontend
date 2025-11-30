export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

// Individual attendance record (simplified for list view)
export interface AttendanceRecord {
  id: number;
  student: number;
  status: AttendanceStatus;
}

// Individual attendance record for a student in a session (detailed view)
export interface Attendance {
  id: number;
  session: number; // The attendance session this record belongs to
  student: number;
  student_name: string;
  student_email: string;
  course_group: number;
  course_group_name: string;
  course_name: string;
  date: string; // Date of the session
  status: AttendanceStatus;
  marked_by: number | null;
  marked_by_name: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Attendance Session - represents a class session
export interface AttendanceSession {
  id: number;
  course_group: number;
  course_group_name: string;
  course_name: string;
  date: string; // Date of the session
  created_by: number;
  created_by_name: string;
  notes: string | null; // Session notes
  total_students: number;
  present_count: number;
  absent_count: number;
  late_count: number;
  excused_count: number;
  created_at: string;
  updated_at: string;
  attendance_records: AttendanceRecord[];
}

// Detailed session view with all attendance records
export interface AttendanceSessionDetail {
  id: number;
  course_group: number;
  course_group_name: string;
  course_name: string;
  date: string; // Date of the session
  created_by: number;
  created_by_name: string;
  notes: string | null; // Session notes
  total_students: number;
  present_count: number;
  absent_count: number;
  late_count: number;
  excused_count: number;
  attendance_records: Attendance[];
  created_at: string;
  updated_at: string;
}

// Create a new attendance session
export interface AttendanceSessionCreate {
  course_group: number;
  date: string;
  notes?: string | null;
}

// Update an attendance session
export interface AttendanceSessionUpdate {
  course_group: number;
  date: string;
  notes?: string | null;
}

// Partial update for an attendance session
export interface AttendanceSessionPartialUpdate {
  course_group?: number;
  date?: string;
  notes?: string | null;
}

// Bulk update attendance statuses for multiple students
export interface BulkAttendanceUpdate {
  attendance_id: number;
  status: AttendanceStatus;
  notes?: string;
}

export interface BulkAttendanceUpdatePayload {
  updates: BulkAttendanceUpdate[];
}

// Student Attendance Stats
export interface StudentAttendanceStats {
  course_group_id: number;
  course_group_name: string;
  course_name: string;
  branch_name: string;
  total_sessions: number;
  present_count: number;
  absent_count: number;
  late_count: number;
  excused_count: number;
  attendance_percentage: number;
  first_session_date: string | null;
  last_session_date: string | null;
}

// Query params
export interface AttendanceSessionListParams {
  course_group?: number;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface StudentAttendanceStatsParams {
  course_group?: number;
}

// Query parameters for listing attendance sessions
export interface AttendanceSessionListParams {
  course_group?: number; // REQUIRED in practice
  created_by?: number;
  date?: string; // format: YYYY-MM-DD
  search?: string;
}
