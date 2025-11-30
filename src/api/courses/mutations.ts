import { createMutation } from 'config';
import api from 'config/api';
import type {
  Course,
  CourseCreate,
  CourseGroup,
  CourseGroupCreate,
  CourseGroupUpdate,
  CourseUpdate,
} from './types';

// API functions
const createCourse = async (data: CourseCreate): Promise<Course> => {
  const response = await api.post('/courses/', data);
  return response.data;
};

const updateCourse = async ({ id, data }: { id: number; data: CourseUpdate }): Promise<Course> => {
  const response = await api.put(`/courses/${id}/`, data);
  return response.data;
};

const partialUpdateCourse = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<CourseUpdate>;
}): Promise<Course> => {
  const response = await api.patch(`/courses/${id}/`, data);
  return response.data;
};

const deleteCourse = async (id: number): Promise<void> => {
  await api.delete(`/courses/${id}/`);
};

// Course Group API functions
const createCourseGroup = async ({
  courseId,
  data,
}: {
  courseId: number;
  data: CourseGroupCreate;
}): Promise<CourseGroup> => {
  const response = await api.post(`/courses/${courseId}/groups/`, data);
  return response.data;
};

const updateCourseGroup = async ({
  courseId,
  groupId,
  data,
}: {
  courseId: number;
  groupId: number;
  data: CourseGroupUpdate;
}): Promise<CourseGroup> => {
  const response = await api.put(`/courses/${courseId}/groups/${groupId}/`, data);
  return response.data;
};

const partialUpdateCourseGroup = async ({
  courseId,
  groupId,
  data,
}: {
  courseId: number;
  groupId: number;
  data: Partial<CourseGroupUpdate>;
}): Promise<CourseGroup> => {
  const response = await api.patch(`/courses/${courseId}/groups/${groupId}/`, data);
  return response.data;
};

const deleteCourseGroup = async ({
  courseId,
  groupId,
}: {
  courseId: number;
  groupId: number;
}): Promise<void> => {
  await api.delete(`/courses/${courseId}/groups/${groupId}/`);
};

// Mutation hooks
export const useCreateCourseMutation = createMutation<Course, CourseCreate>({
  mutationFn: createCourse,
  invalidateKeys: ['courses'],
  onSuccessMessage: 'Kurs uğurla yaradıldı!',
  onErrorMessage: 'Kurs yaratmaq alınmadı',
});

export const useUpdateCourseMutation = createMutation<Course, { id: number; data: CourseUpdate }>({
  mutationFn: updateCourse,
  invalidateKeys: ['courses'],
  onSuccessMessage: 'Kurs uğurla yeniləndi!',
  onErrorMessage: 'Kurs yeniləmək alınmadı',
});

export const usePartialUpdateCourseMutation = createMutation<
  Course,
  { id: number; data: Partial<CourseUpdate> }
>({
  mutationFn: partialUpdateCourse,
  invalidateKeys: ['courses'],
  onSuccessMessage: 'Kurs uğurla yeniləndi!',
  onErrorMessage: 'Kurs yeniləmək alınmadı',
});

export const useDeleteCourseMutation = createMutation<void, number>({
  mutationFn: deleteCourse,
  invalidateKeys: ['courses'],
  onSuccessMessage: 'Kurs uğurla silindi!',
  onErrorMessage: 'Kurs silmək alınmadı',
});

// Course Group Mutation hooks
export const useCreateCourseGroupMutation = createMutation<
  CourseGroup,
  { courseId: number; data: CourseGroupCreate }
>({
  mutationFn: createCourseGroup,
  invalidateKeys: ['courses'],
  onSuccessMessage: 'Qrup uğurla yaradıldı!',
  onErrorMessage: 'Qrup yaratmaq alınmadı',
});

export const useUpdateCourseGroupMutation = createMutation<
  CourseGroup,
  { courseId: number; groupId: number; data: CourseGroupUpdate }
>({
  mutationFn: updateCourseGroup,
  invalidateKeys: ['courses'],
  onSuccessMessage: 'Qrup uğurla yeniləndi!',
  onErrorMessage: 'Qrup yeniləmək alınmadı',
});

export const usePartialUpdateCourseGroupMutation = createMutation<
  CourseGroup,
  { courseId: number; groupId: number; data: Partial<CourseGroupUpdate> }
>({
  mutationFn: partialUpdateCourseGroup,
  invalidateKeys: ['courses'],
  onSuccessMessage: 'Qrup uğurla yeniləndi!',
  onErrorMessage: 'Qrup yeniləmək alınmadı',
});

export const useDeleteCourseGroupMutation = createMutation<
  void,
  { courseId: number; groupId: number }
>({
  mutationFn: deleteCourseGroup,
  invalidateKeys: ['courses'],
  onSuccessMessage: 'Qrup uğurla silindi!',
  onErrorMessage: 'Qrup silmək alınmadı',
});
