import { createMutation } from '../../config';
import api from '../../config/api';
import type { Branch, BranchCreate, BranchUpdate } from './types';

// API functions
const createBranch = async (data: BranchCreate): Promise<Branch> => {
  const response = await api.post('/branches/', data);
  return response.data;
};

const updateBranch = async ({ id, data }: { id: number; data: BranchUpdate }): Promise<Branch> => {
  const response = await api.put(`/branches/${id}/`, data);
  return response.data;
};

const partialUpdateBranch = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<BranchUpdate>;
}): Promise<Branch> => {
  const response = await api.patch(`/branches/${id}/`, data);
  return response.data;
};

const deleteBranch = async (id: number): Promise<void> => {
  await api.delete(`/branches/${id}/`);
};

// Mutation hooks
export const useCreateBranchMutation = createMutation<Branch, BranchCreate>({
  mutationFn: createBranch,
  invalidateKeys: ['branches'],
  onSuccessMessage: 'Filial uğurla yaradıldı!',
  onErrorMessage: 'Filial yaratmaq alınmadı',
});

export const useUpdateBranchMutation = createMutation<Branch, { id: number; data: BranchUpdate }>({
  mutationFn: updateBranch,
  invalidateKeys: ['branches'],
  onSuccessMessage: 'Filial uğurla yeniləndi!',
  onErrorMessage: 'Filial yeniləmək alınmadı',
});

export const usePartialUpdateBranchMutation = createMutation<
  Branch,
  { id: number; data: Partial<BranchUpdate> }
>({
  mutationFn: partialUpdateBranch,
  invalidateKeys: ['branches'],
  onSuccessMessage: 'Filial uğurla yeniləndi!',
  onErrorMessage: 'Filial yeniləmək alınmadı',
});

export const useDeleteBranchMutation = createMutation<void, number>({
  mutationFn: deleteBranch,
  invalidateKeys: ['branches'],
  onSuccessMessage: 'Filial uğurla silindi!',
  onErrorMessage: 'Filial silmək alınmadı',
});
