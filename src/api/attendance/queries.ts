import { createQuery } from '../../config';
import api from '../../config/api';
import type {
  AttendanceSession,
  AttendanceSessionDetail,
  AttendanceSessionListParams,
  SessionStudentsResponse,
} from './types';

// API functions
const fetchAttendanceSessions = async (
  params?: AttendanceSessionListParams
): Promise<AttendanceSession[]> => {
  const response = await api.get('/attendance-sessions/', { params });
  return response.data;
};

const fetchAttendanceSession = async (id: number): Promise<AttendanceSessionDetail> => {
  const response = await api.get(`/attendance-sessions/${id}/`);
  return response.data;
};

const fetchSessionStudents = async (sessionId: number): Promise<SessionStudentsResponse> => {
  const response = await api.get(`/attendance-sessions/${sessionId}/students/`);
  return response.data;
};

const fetchAttendanceSessionsByCourseGroup = async (
  courseGroupId: number,
  params?: Omit<AttendanceSessionListParams, 'course_group'>
): Promise<AttendanceSession[]> => {
  const response = await api.get(`/attendance-sessions/list_by_course_group/`, {
    params: { ...params, course_group: courseGroupId },
  });
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

export const useSessionStudentsQuery = (sessionId: number) => {
  return createQuery<SessionStudentsResponse>({
    queryKey: ['attendance-sessions', 'students', sessionId],
    queryFn: () => fetchSessionStudents(sessionId),
    options: {
      enabled: !!sessionId,
    },
  })();
};

export const useAttendanceSessionsByCourseGroupQuery = (
  courseGroupId: number,
  params?: Omit<AttendanceSessionListParams, 'course_group'>
) => {
  return createQuery<AttendanceSession[]>({
    queryKey: ['attendance-sessions', 'by-course-group', courseGroupId, JSON.stringify(params)],
    queryFn: () => fetchAttendanceSessionsByCourseGroup(courseGroupId, params),
    options: {
      enabled: !!courseGroupId,
    },
  })();
};
