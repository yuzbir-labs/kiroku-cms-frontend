import { createQuery } from '../../config';
import api from '../../config/api';
import type { Enrollment, EnrollmentListParams } from './types';

// API functions
const fetchEnrollments = async (params?: EnrollmentListParams): Promise<Enrollment[]> => {
  const response = await api.get('/enrollments/', { params });
  return response.data;
};

const fetchEnrollment = async (id: number): Promise<Enrollment> => {
  const response = await api.get(`/enrollments/${id}/`);
  return response.data;
};

// Query hooks
export const useEnrollmentsQuery = (params?: EnrollmentListParams) => {
  return createQuery<Enrollment[]>({
    queryKey: ['enrollments', 'list', params],
    queryFn: () => fetchEnrollments(params),
  })();
};

export const useEnrollmentQuery = (id: number) => {
  return createQuery<Enrollment>({
    queryKey: ['enrollments', 'detail', id],
    queryFn: () => fetchEnrollment(id),
    options: {
      enabled: !!id,
    },
  })();
};

// Helper hook: fetch enrollments by course group
export const useEnrollmentsByCourseGroupQuery = (courseGroupId: number) => {
  return createQuery<Enrollment[]>({
    queryKey: ['enrollments', 'by-course-group', courseGroupId],
    queryFn: () => fetchEnrollments({ course_group: courseGroupId }),
    options: {
      enabled: !!courseGroupId,
    },
  })();
};
