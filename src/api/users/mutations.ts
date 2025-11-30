import { createMutation } from '../../config';
import api from '../../config/api';
import type { User } from '../auth/types';
import type { UserCreate, UserUpdate } from './types';

// API functions
const createUser = async (data: UserCreate): Promise<User> => {
  const response = await api.post('/users/', data);
  return response.data;
};

const updateUser = async ({ id, data }: { id: number; data: UserUpdate }): Promise<User> => {
  const response = await api.put(`/users/${id}/`, data);
  return response.data;
};

const partialUpdateUser = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<UserUpdate>;
}): Promise<User> => {
  const response = await api.patch(`/users/${id}/`, data);
  return response.data;
};

const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}/`);
};

// Mutation hooks
export const useCreateUserMutation = createMutation<User, UserCreate>({
  mutationFn: createUser,
  invalidateKeys: ['users'],
  onSuccessMessage: 'İstifadəçi uğurla yaradıldı!',
  onErrorMessage: 'İstifadəçi yaratmaq alınmadı',
});

export const useUpdateUserMutation = createMutation<User, { id: number; data: UserUpdate }>({
  mutationFn: updateUser,
  invalidateKeys: ['users'],
  onSuccessMessage: 'İstifadəçi uğurla yeniləndi!',
  onErrorMessage: 'İstifadəçi yeniləmək alınmadı',
});

export const usePartialUpdateUserMutation = createMutation<
  User,
  { id: number; data: Partial<UserUpdate> }
>({
  mutationFn: partialUpdateUser,
  invalidateKeys: ['users'],
  onSuccessMessage: 'İstifadəçi uğurla yeniləndi!',
  onErrorMessage: 'İstifadəçi yeniləmək alınmadı',
});

export const useDeleteUserMutation = createMutation<void, number>({
  mutationFn: deleteUser,
  invalidateKeys: ['users'],
  onSuccessMessage: 'İstifadəçi uğurla silindi!',
  onErrorMessage: 'İstifadəçi silmək alınmadı',
});
