import { createMutation } from '../../config';
import api from '../../config/api';
import type { Organization, OrganizationCreate, OrganizationUpdate } from './types';

// API functions
const createOrganization = async (data: OrganizationCreate): Promise<Organization> => {
  const response = await api.post('/organizations/', data);
  return response.data;
};

const updateOrganization = async ({
  id,
  data,
}: {
  id: number;
  data: OrganizationUpdate;
}): Promise<Organization> => {
  const response = await api.put(`/organizations/${id}/`, data);
  return response.data;
};

const partialUpdateOrganization = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<OrganizationUpdate>;
}): Promise<Organization> => {
  const response = await api.patch(`/organizations/${id}/`, data);
  return response.data;
};

const deleteOrganization = async (id: number): Promise<void> => {
  await api.delete(`/organizations/${id}/`);
};

// Mutation hooks
export const useCreateOrganizationMutation = createMutation<Organization, OrganizationCreate>({
  mutationFn: createOrganization,
  invalidateKeys: ['organizations'],
  onSuccessMessage: 'Təşkilat uğurla yaradıldı!',
  onErrorMessage: 'Təşkilat yaratmaq alınmadı',
});

export const useUpdateOrganizationMutation = createMutation<
  Organization,
  { id: number; data: OrganizationUpdate }
>({
  mutationFn: updateOrganization,
  invalidateKeys: ['organizations'],
  onSuccessMessage: 'Təşkilat uğurla yeniləndi!',
  onErrorMessage: 'Təşkilat yeniləmək alınmadı',
});

export const usePartialUpdateOrganizationMutation = createMutation<
  Organization,
  { id: number; data: Partial<OrganizationUpdate> }
>({
  mutationFn: partialUpdateOrganization,
  invalidateKeys: ['organizations'],
  onSuccessMessage: 'Təşkilat uğurla yeniləndi!',
  onErrorMessage: 'Təşkilat yeniləmək alınmadı',
});

export const useDeleteOrganizationMutation = createMutation<void, number>({
  mutationFn: deleteOrganization,
  invalidateKeys: ['organizations'],
  onSuccessMessage: 'Təşkilat uğurla silindi!',
  onErrorMessage: 'Təşkilat silmək alınmadı',
});
