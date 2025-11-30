import { createMutation } from '../../config';
import api from '../../config/api';
import type {
  GradingSyllabusDetail,
  GradingSyllabusCreate,
  GradingSyllabusUpdate,
  StudentGrade,
  BulkGradeInput,
} from './types';

// API functions
const createGradingSyllabus = async (
  data: GradingSyllabusCreate
): Promise<GradingSyllabusDetail> => {
  const response = await api.post('/grading/syllabi/', data);
  return response.data;
};

const updateGradingSyllabus = async ({
  id,
  data,
}: {
  id: number;
  data: GradingSyllabusUpdate;
}): Promise<GradingSyllabusDetail> => {
  const response = await api.put(`/grading/syllabi/${id}/`, data);
  return response.data;
};

const deleteGradingSyllabus = async (id: number): Promise<void> => {
  await api.delete(`/grading/syllabi/${id}/`);
};

const bulkGradeStudents = async ({
  sectionId,
  data,
}: {
  sectionId: number;
  data: BulkGradeInput;
}): Promise<{ results: StudentGrade[] }> => {
  const response = await api.post(`/grading/sections/${sectionId}/grades/`, data);
  return response.data;
};

// Mutation hooks
export const useCreateGradingSyllabusMutation = createMutation<
  GradingSyllabusDetail,
  GradingSyllabusCreate
>({
  mutationFn: createGradingSyllabus,
  invalidateKeys: ['grading-syllabi'],
  onSuccessMessage: 'Qiymətləndirmə meyarları uğurla yaradıldı!',
  onErrorMessage: 'Qiymətləndirmə meyarları yaratmaq alınmadı',
});

export const useUpdateGradingSyllabusMutation = createMutation<
  GradingSyllabusDetail,
  { id: number; data: GradingSyllabusUpdate }
>({
  mutationFn: updateGradingSyllabus,
  invalidateKeys: ['grading-syllabi', 'grading-sections'],
  onSuccessMessage: 'Qiymətləndirmə meyarları uğurla yeniləndi!',
  onErrorMessage: 'Qiymətləndirmə meyarları yeniləmək alınmadı',
});

export const useDeleteGradingSyllabusMutation = createMutation<void, number>({
  mutationFn: deleteGradingSyllabus,
  invalidateKeys: ['grading-syllabi', 'grading-sections', 'student-grades'],
  onSuccessMessage: 'Qiymətləndirmə meyarları uğurla silindi!',
  onErrorMessage: 'Qiymətləndirmə meyarları silmək alınmadı',
});

export const useBulkGradeStudentsMutation = createMutation<
  { results: StudentGrade[] },
  { sectionId: number; data: BulkGradeInput }
>({
  mutationFn: bulkGradeStudents,
  invalidateKeys: ['student-grades'],
  onSuccessMessage: 'Qiymətlər uğurla əlavə edildi!',
  onErrorMessage: 'Qiymətləri əlavə etmək alınmadı',
});
