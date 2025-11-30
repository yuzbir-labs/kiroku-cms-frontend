import { createMutation } from 'config';
import api from 'config/api';
import type {
  AttendanceSession,
  AttendanceSessionCreate,
  AttendanceSessionPartialUpdate,
  AttendanceSessionUpdate,
  BulkAttendanceUpdatePayload,
} from './types';

// API functions
const createAttendanceSession = async (
  data: AttendanceSessionCreate
): Promise<AttendanceSession> => {
  const response = await api.post('/attendance/create/', data);
  return response.data;
};

const updateAttendanceSession = async ({
  id,
  data,
}: {
  id: number;
  data: AttendanceSessionUpdate;
}): Promise<AttendanceSession> => {
  const response = await api.put(`/attendance/${id}/update/`, data);
  return response.data;
};

const partialUpdateAttendanceSession = async ({
  id,
  data,
}: {
  id: number;
  data: AttendanceSessionPartialUpdate;
}): Promise<AttendanceSession> => {
  const response = await api.patch(`/attendance/${id}/update/`, data);
  return response.data;
};

const deleteAttendanceSession = async (id: number): Promise<void> => {
  await api.delete(`/attendance/${id}/delete/`);
};

const bulkUpdateAttendance = async ({
  sessionId,
  data,
}: {
  sessionId: number;
  data: BulkAttendanceUpdatePayload;
}): Promise<AttendanceSession> => {
  const response = await api.post(`/attendance/${sessionId}/bulk-update/`, data);
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
  { id: number; data: AttendanceSessionPartialUpdate }
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

export const useBulkUpdateAttendanceMutation = createMutation<
  AttendanceSession,
  { sessionId: number; data: BulkAttendanceUpdatePayload }
>({
  mutationFn: bulkUpdateAttendance,
  invalidateKeys: ['attendance-sessions'],
  onSuccessMessage: 'Davamiyyət uğurla yeniləndi!',
  onErrorMessage: 'Davamiyyət yeniləmək alınmadı',
});
