import { createMutation } from 'config';
import api from 'config/api';
import type {
  Inquiry,
  InquiryAssignRequest,
  InquiryConvertRequest,
  InquiryCreate,
  InquiryUpdate,
} from './types';

// API functions
const createInquiry = async (data: InquiryCreate): Promise<Inquiry> => {
  const response = await api.post('/inquiries/', data);
  return response.data;
};

const updateInquiry = async ({
  id,
  data,
}: {
  id: number;
  data: InquiryUpdate;
}): Promise<Inquiry> => {
  const response = await api.put(`/inquiries/${id}/`, data);
  return response.data;
};

const partialUpdateInquiry = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<InquiryUpdate>;
}): Promise<Inquiry> => {
  const response = await api.patch(`/inquiries/${id}/`, data);
  return response.data;
};

const deleteInquiry = async (id: number): Promise<void> => {
  await api.delete(`/inquiries/${id}/`);
};

const assignInquiry = async ({
  id,
  data,
}: {
  id: number;
  data: InquiryAssignRequest;
}): Promise<Inquiry> => {
  const response = await api.post(`/inquiries/${id}/assign/`, data);
  return response.data;
};

const convertInquiry = async ({
  id,
  data = {},
}: {
  id: number;
  data?: InquiryConvertRequest;
}): Promise<Inquiry> => {
  const response = await api.post(`/inquiries/${id}/convert/`, data);
  return response.data;
};

// Mutation hooks
export const useCreateInquiryMutation = createMutation<Inquiry, InquiryCreate>({
  mutationFn: createInquiry,
  invalidateKeys: ['inquiries'],
  onSuccessMessage: 'Sorğu uğurla yaradıldı!',
  onErrorMessage: 'Sorğu yaratmaq alınmadı',
});

export const useUpdateInquiryMutation = createMutation<
  Inquiry,
  { id: number; data: InquiryUpdate }
>({
  mutationFn: updateInquiry,
  invalidateKeys: ['inquiries'],
  onSuccessMessage: 'Sorğu uğurla yeniləndi!',
  onErrorMessage: 'Sorğu yeniləmək alınmadı',
});

export const usePartialUpdateInquiryMutation = createMutation<
  Inquiry,
  { id: number; data: Partial<InquiryUpdate> }
>({
  mutationFn: partialUpdateInquiry,
  invalidateKeys: ['inquiries'],
  onSuccessMessage: 'Sorğu uğurla yeniləndi!',
  onErrorMessage: 'Sorğu yeniləmək alınmadı',
});

export const useDeleteInquiryMutation = createMutation<void, number>({
  mutationFn: deleteInquiry,
  invalidateKeys: ['inquiries'],
  onSuccessMessage: 'Sorğu uğurla silindi!',
  onErrorMessage: 'Sorğu silmək alınmadı',
});

export const useAssignInquiryMutation = createMutation<
  Inquiry,
  { id: number; data: InquiryAssignRequest }
>({
  mutationFn: assignInquiry,
  invalidateKeys: ['inquiries'],
  onSuccessMessage: 'Sorğu uğurla təyin edildi!',
  onErrorMessage: 'Sorğu təyin etmək alınmadı',
});

export const useConvertInquiryMutation = createMutation<
  Inquiry,
  { id: number; data?: InquiryConvertRequest }
>({
  mutationFn: convertInquiry,
  invalidateKeys: ['inquiries', 'enrollments'],
  onSuccessMessage: 'Sorğu uğurla tələbəyə çevrildi!',
  onErrorMessage: 'Sorğu çevirmək alınmadı',
});
