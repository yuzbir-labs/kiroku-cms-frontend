export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

// Individual attendance record for a student in a session
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
  is_finalized: boolean; // Whether attendance has been finalized
  total_students: number;
  present_count: number;
  absent_count: number;
  late_count: number;
  excused_count: number;
  created_at: string;
  updated_at: string;
}

// Detailed session view with all attendance records
export interface AttendanceSessionDetail extends AttendanceSession {
  attendance_records: Attendance[];
}

// Create a new attendance session
export interface AttendanceSessionCreate {
  course_group: number;
  date: string;
  notes?: string | null;
  is_finalized?: boolean;
}

// Update an attendance session
export interface AttendanceSessionUpdate {
  course_group?: number;
  date?: string;
  notes?: string | null;
  is_finalized?: boolean;
}

// Mark attendance for a single student
export interface MarkStudentAttendance {
  student_id: number;
  status: AttendanceStatus; // PRESENT, ABSENT, LATE, or EXCUSED
  notes?: string;
}

// Query parameters for listing attendance sessions
export interface AttendanceSessionListParams {
  course_group?: number; // REQUIRED in practice
  created_by?: number;
  date?: string; // format: YYYY-MM-DD
  is_finalized?: boolean;
  search?: string;
}

// Student with attendance status (for students list endpoint)
export interface StudentAttendanceStatus {
  student_id: number;
  student_name: string;
  student_email: string;
  status: AttendanceStatus;
  notes: string | null;
  marked: boolean; // Whether status has been changed from default ABSENT
}

// Response from students endpoint
export interface SessionStudentsResponse {
  session_id: number;
  course_group_id: number;
  date: string;
  total_students: number;
  marked_count: number;
  unmarked_count: number;
  students: StudentAttendanceStatus[];
}
