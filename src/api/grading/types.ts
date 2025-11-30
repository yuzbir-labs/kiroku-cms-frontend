// Grading Section
export interface GradingSection {
  id: number;
  grading_syllabus: number;
  name: string; // e.g., 'Midterm Exam', 'Final Project'
  description?: string;
  weight: number; // Weight percentage (0-100)
  max_score: number; // Maximum score possible
  order: number;
  created_at: string;
  updated_at: string;
}

// Grading Section Create/Update
export interface GradingSectionInput {
  name: string;
  weight: number;
  max_score: number;
  description?: string;
  order?: number;
}

// Grading Syllabus
export interface GradingSyllabus {
  id: number;
  course_group: number;
  course_group_name: string;
  created_by: number | null;
  name: string;
  description?: string;
  is_active: boolean;
  total_weight: number;
  created_at: string;
  updated_at: string;
}

// Grading Syllabus with Sections
export interface GradingSyllabusDetail extends GradingSyllabus {
  created_by_name: string;
  sections: GradingSection[];
}

// Grading Syllabus Create
export interface GradingSyllabusCreate {
  course_group: number;
  name: string;
  description?: string;
  is_active?: boolean;
  sections: GradingSectionInput[];
}

// Grading Syllabus Update
export interface GradingSyllabusUpdate {
  name?: string;
  description?: string;
  is_active?: boolean;
  sections?: GradingSectionInput[];
}

// Student Grade
export interface StudentGrade {
  id: number;
  grading_section: number;
  section_name: string;
  student: number;
  student_name: string;
  score: number;
  max_score: number;
  percentage: number;
  weighted_score: number;
  feedback?: string;
  graded_by: number | null;
  graded_by_name: string;
  graded_at: string;
  created_at: string;
  updated_at: string;
}

// Student Grade Input
export interface StudentGradeInput {
  student: number;
  score: number;
  feedback?: string;
}

// Bulk Grade Input
export interface BulkGradeInput {
  grades: StudentGradeInput[];
}

// Student Grade Report
export interface StudentGradeReport {
  course_group_id: number;
  course_group_name: string;
  course_name: string;
  syllabus_name: string;
  student_id: number;
  student_name: string;
  grades: StudentGrade[];
  final_score: number;
  total_weight_graded: number;
}

// Query params
export interface GradingSyllabusListParams {
  course_group: number;
  page?: number;
  page_size?: number;
}

export interface GradingSectionListParams {
  syllabus: number;
  page?: number;
  page_size?: number;
}

export interface StudentGradeListParams {
  page?: number;
  page_size?: number;
}

export interface StudentGradeReportParams {
  course_group: number;
  student?: number; // Required for teachers, optional for students (auto-filled)
}
