import { createQuery } from '../../config';
import api from '../../config/api';
import type {
  AttendanceSession,
  AttendanceSessionDetail,
  AttendanceSessionListParams,
  StudentAttendanceStats,
  StudentAttendanceStatsParams,
} from './types';

// API functions
const fetchAttendanceSessions = async (
  params?: AttendanceSessionListParams
): Promise<AttendanceSession[]> => {
  const response = await api.get('/attendance/', { params });
  return response.data.results || response.data;
};

const fetchAttendanceSession = async (id: number): Promise<AttendanceSessionDetail> => {
  const response = await api.get(`/attendance/${id}/`);
  return response.data;
};

// Query hooks
export const useAttendanceSessionsQuery = (params?: AttendanceSessionListParams) => {
  return createQuery<AttendanceSession[]>({
    queryKey: ['attendance-sessions', 'list', JSON.stringify(params)],
    queryFn: () => fetchAttendanceSessions(params),
    options: {
      // Require course_group parameter for optimal performance
      enabled: !!params?.course_group,
    },
  })();
};

export const useAttendanceSessionQuery = (id: number) => {
  return createQuery<AttendanceSessionDetail>({
    queryKey: ['attendance-sessions', 'detail', id],
    queryFn: () => fetchAttendanceSession(id),
    options: {
      enabled: !!id,
    },
  })();
};

// API functions - Student Stats
const fetchStudentAttendanceStats = async (
  params?: StudentAttendanceStatsParams
): Promise<StudentAttendanceStats[]> => {
  const response = await api.get('/attendance/my-stats/', { params });
  return response.data;
};

// Helper hook: fetch attendance sessions by course group
export const useAttendanceSessionsByCourseGroupQuery = (
  courseGroupId: number,
  params?: Omit<AttendanceSessionListParams, 'course_group'>
) => {
  return createQuery<AttendanceSession[]>({
    queryKey: ['attendance-sessions', 'by-course-group', courseGroupId, JSON.stringify(params)],
    queryFn: () => fetchAttendanceSessions({ ...params, course_group: courseGroupId }),
    options: {
      enabled: !!courseGroupId,
    },
  })();
};

// Query hook: fetch student attendance stats
export const useStudentAttendanceStatsQuery = (params?: StudentAttendanceStatsParams) => {
  return createQuery<StudentAttendanceStats[]>({
    queryKey: ['attendance-stats', 'my-stats', JSON.stringify(params || {})],
    queryFn: () => fetchStudentAttendanceStats(params),
  })();
};
