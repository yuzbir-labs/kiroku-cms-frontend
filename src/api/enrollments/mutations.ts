import { createMutation } from '../../config';
import api from '../../config/api';
import type { Enrollment, EnrollmentCreate, EnrollmentUpdate } from './types';

// API functions
const createEnrollment = async (data: EnrollmentCreate): Promise<Enrollment> => {
  const response = await api.post('/enrollments/', data);
  return response.data;
};

const updateEnrollment = async ({
  id,
  data,
}: {
  id: number;
  data: EnrollmentUpdate;
}): Promise<Enrollment> => {
  const response = await api.put(`/enrollments/${id}/`, data);
  return response.data;
};

const partialUpdateEnrollment = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<EnrollmentUpdate>;
}): Promise<Enrollment> => {
  const response = await api.patch(`/enrollments/${id}/`, data);
  return response.data;
};

const deleteEnrollment = async (id: number): Promise<void> => {
  await api.delete(`/enrollments/${id}/`);
};

const completeEnrollment = async (id: number): Promise<Enrollment> => {
  const response = await api.post(`/enrollments/${id}/complete/`, {});
  return response.data;
};

const dropEnrollment = async (id: number): Promise<Enrollment> => {
  const response = await api.post(`/enrollments/${id}/drop/`, {});
  return response.data;
};

// Mutation hooks
export const useCreateEnrollmentMutation = createMutation<Enrollment, EnrollmentCreate>({
  mutationFn: createEnrollment,
  invalidateKeys: ['enrollments'],
  onSuccessMessage: 'Qeydiyyat uğurla yaradıldı!',
  onErrorMessage: 'Qeydiyyat yaratmaq alınmadı',
});

export const useUpdateEnrollmentMutation = createMutation<
  Enrollment,
  { id: number; data: EnrollmentUpdate }
>({
  mutationFn: updateEnrollment,
  invalidateKeys: ['enrollments'],
  onSuccessMessage: 'Qeydiyyat uğurla yeniləndi!',
  onErrorMessage: 'Qeydiyyat yeniləmək alınmadı',
});

export const usePartialUpdateEnrollmentMutation = createMutation<
  Enrollment,
  { id: number; data: Partial<EnrollmentUpdate> }
>({
  mutationFn: partialUpdateEnrollment,
  invalidateKeys: ['enrollments'],
  onSuccessMessage: 'Qeydiyyat uğurla yeniləndi!',
  onErrorMessage: 'Qeydiyyat yeniləmək alınmadı',
});

export const useDeleteEnrollmentMutation = createMutation<void, number>({
  mutationFn: deleteEnrollment,
  invalidateKeys: ['enrollments'],
  onSuccessMessage: 'Qeydiyyat uğurla silindi!',
  onErrorMessage: 'Qeydiyyat silmək alınmadı',
});

export const useCompleteEnrollmentMutation = createMutation<Enrollment, number>({
  mutationFn: completeEnrollment,
  invalidateKeys: ['enrollments'],
  onSuccessMessage: 'Qeydiyyat uğurla tamamlandı!',
  onErrorMessage: 'Qeydiyyatı tamamlamaq alınmadı',
});

export const useDropEnrollmentMutation = createMutation<Enrollment, number>({
  mutationFn: dropEnrollment,
  invalidateKeys: ['enrollments'],
  onSuccessMessage: 'Qeydiyyat uğurla ləğv edildi!',
  onErrorMessage: 'Qeydiyyatı ləğv etmək alınmadı',
});
