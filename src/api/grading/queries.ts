import { createQuery } from 'config';
import api from 'config/api';
import type {
  GradingSection,
  GradingSectionListParams,
  GradingSyllabus,
  GradingSyllabusDetail,
  GradingSyllabusListParams,
  StudentGrade,
  StudentGradeListParams,
  StudentGradeReport,
  StudentGradeReportParams,
} from './types';

// API functions - Syllabi
const fetchGradingSyllabi = async (
  params: GradingSyllabusListParams
): Promise<{ results: GradingSyllabus[]; count: number }> => {
  const response = await api.get('/grading/syllabi/', { params });
  return response.data;
};

const fetchGradingSyllabus = async (id: number): Promise<GradingSyllabusDetail> => {
  const response = await api.get(`/grading/syllabi/${id}/`);
  return response.data;
};

// API functions - Sections
const fetchGradingSections = async (
  params: GradingSectionListParams
): Promise<{ results: GradingSection[]; count: number }> => {
  const response = await api.get('/grading/sections/', { params });
  return response.data;
};

const fetchGradingSection = async (id: number): Promise<GradingSection> => {
  const response = await api.get(`/grading/sections/${id}/`);
  return response.data;
};

// API functions - Grades
const fetchStudentGrades = async (
  sectionId: number,
  params?: StudentGradeListParams
): Promise<{ results: StudentGrade[]; count: number }> => {
  const response = await api.get(`/grading/sections/${sectionId}/grades/`, {
    params,
  });
  return response.data;
};

const fetchStudentGradeReport = async (
  params: StudentGradeReportParams
): Promise<StudentGradeReport> => {
  const response = await api.get('/grading/grades/report/', { params });
  return response.data;
};

// Query hooks - Syllabi
export const useGradingSyllabiQuery = (params: GradingSyllabusListParams) => {
  return createQuery<{ results: GradingSyllabus[]; count: number }>({
    queryKey: ['grading-syllabi', 'list', JSON.stringify(params)],
    queryFn: () => fetchGradingSyllabi(params),
    options: {
      enabled: !!params.course_group,
    },
  })();
};

export const useGradingSyllabusQuery = (id: number) => {
  return createQuery<GradingSyllabusDetail>({
    queryKey: ['grading-syllabi', 'detail', id],
    queryFn: () => fetchGradingSyllabus(id),
    options: {
      enabled: !!id,
    },
  })();
};

// Query hooks - Sections
export const useGradingSectionsQuery = (params: GradingSectionListParams) => {
  return createQuery<{ results: GradingSection[]; count: number }>({
    queryKey: ['grading-sections', 'list', JSON.stringify(params)],
    queryFn: () => fetchGradingSections(params),
    options: {
      enabled: !!params.syllabus,
    },
  })();
};

export const useGradingSectionQuery = (id: number) => {
  return createQuery<GradingSection>({
    queryKey: ['grading-sections', 'detail', id],
    queryFn: () => fetchGradingSection(id),
    options: {
      enabled: !!id,
    },
  })();
};

// Query hooks - Grades
export const useStudentGradesQuery = (sectionId: number, params?: StudentGradeListParams) => {
  return createQuery<{ results: StudentGrade[]; count: number }>({
    queryKey: ['student-grades', 'list', sectionId, JSON.stringify(params || {})],
    queryFn: () => fetchStudentGrades(sectionId, params),
    options: {
      enabled: !!sectionId,
    },
  })();
};

export const useStudentGradeReportQuery = (params: StudentGradeReportParams) => {
  return createQuery<StudentGradeReport>({
    queryKey: ['student-grades', 'report', JSON.stringify(params)],
    queryFn: () => fetchStudentGradeReport(params),
    options: {
      enabled: !!params.course_group,
    },
  })();
};

// Helper hook: fetch grading syllabus by course group
export const useGradingSyllabusByCourseGroupQuery = (courseGroupId: number) => {
  return useGradingSyllabiQuery({ course_group: courseGroupId });
};
