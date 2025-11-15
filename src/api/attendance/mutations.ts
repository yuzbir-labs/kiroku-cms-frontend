import { createMutation } from '../../config';
import api from '../../config/api';
import type {
  AttendanceSession,
  AttendanceSessionCreate,
  AttendanceSessionUpdate,
  MarkStudentAttendance,
} from './types';

// API functions
const createAttendanceSession = async (
  data: AttendanceSessionCreate
): Promise<AttendanceSession> => {
  const response = await api.post('/attendance-sessions/', data);
  return response.data;
};

const updateAttendanceSession = async ({
  id,
  data,
}: {
  id: number;
  data: AttendanceSessionUpdate;
}): Promise<AttendanceSession> => {
  const response = await api.put(`/attendance-sessions/${id}/`, data);
  return response.data;
};

const partialUpdateAttendanceSession = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<AttendanceSessionUpdate>;
}): Promise<AttendanceSession> => {
  const response = await api.patch(`/attendance-sessions/${id}/`, data);
  return response.data;
};

const deleteAttendanceSession = async (id: number): Promise<void> => {
  await api.delete(`/attendance-sessions/${id}/`);
};

const markStudentAttendance = async ({
  sessionId,
  data,
}: {
  sessionId: number;
  data: MarkStudentAttendance;
}): Promise<AttendanceSession> => {
  const response = await api.post(`/attendance-sessions/${sessionId}/mark_student/`, data);
  return response.data;
};

const finalizeAttendanceSession = async (sessionId: number): Promise<AttendanceSession> => {
  const response = await api.post(`/attendance-sessions/${sessionId}/finalize/`, {});
  return response.data;
};

const unfinalizeAttendanceSession = async (sessionId: number): Promise<AttendanceSession> => {
  const response = await api.post(`/attendance-sessions/${sessionId}/unfinalize/`, {});
  return response.data;
};

// Mutation hooks
export const useCreateAttendanceSessionMutation = createMutation<
  AttendanceSession,
  AttendanceSessionCreate
>({
  mutationFn: createAttendanceSession,
  invalidateKeys: ['attendance-sessions'],
  onSuccessMessage: 'Davamiyyət sessiyası uğurla yaradıldı!',
  onErrorMessage: 'Davamiyyət sessiyası yaratmaq alınmadı',
});

export const useUpdateAttendanceSessionMutation = createMutation<
  AttendanceSession,
  { id: number; data: AttendanceSessionUpdate }
>({
  mutationFn: updateAttendanceSession,
  invalidateKeys: ['attendance-sessions'],
  onSuccessMessage: 'Davamiyyət sessiyası uğurla yeniləndi!',
  onErrorMessage: 'Davamiyyət sessiyası yeniləmək alınmadı',
});

export const usePartialUpdateAttendanceSessionMutation = createMutation<
  AttendanceSession,
  { id: number; data: Partial<AttendanceSessionUpdate> }
>({
  mutationFn: partialUpdateAttendanceSession,
  invalidateKeys: ['attendance-sessions'],
  onSuccessMessage: 'Davamiyyət sessiyası uğurla yeniləndi!',
  onErrorMessage: 'Davamiyyət sessiyası yeniləmək alınmadı',
});

export const useDeleteAttendanceSessionMutation = createMutation<void, number>({
  mutationFn: deleteAttendanceSession,
  invalidateKeys: ['attendance-sessions'],
  onSuccessMessage: 'Davamiyyət sessiyası uğurla silindi!',
  onErrorMessage: 'Davamiyyət sessiyası silmək alınmadı',
});

export const useMarkStudentAttendanceMutation = createMutation<
  AttendanceSession,
  { sessionId: number; data: MarkStudentAttendance }
>({
  mutationFn: markStudentAttendance,
  invalidateKeys: ['attendance-sessions'],
  onSuccessMessage: 'Tələbə davamiyyəti uğurla qeyd edildi!',
  onErrorMessage: 'Tələbə davamiyyəti qeyd etmək alınmadı',
});

export const useFinalizeAttendanceSessionMutation = createMutation<AttendanceSession, number>({
  mutationFn: finalizeAttendanceSession,
  invalidateKeys: ['attendance-sessions'],
  onSuccessMessage: 'Davamiyyət sessiyası uğurla tamamlandı!',
  onErrorMessage: 'Davamiyyət sessiyası tamamlamaq alınmadı',
});

export const useUnfinalizeAttendanceSessionMutation = createMutation<AttendanceSession, number>({
  mutationFn: unfinalizeAttendanceSession,
  invalidateKeys: ['attendance-sessions'],
  onSuccessMessage: 'Davamiyyət sessiyası redaktə üçün açıldı!',
  onErrorMessage: 'Davamiyyət sessiyası açmaq alınmadı',
});
