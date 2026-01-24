import { createMutation } from 'config';
import api from 'config/api';
import type { InquiryNote, InquiryNoteCreate, InquiryNoteUpdate } from './types';

// API functions
const createInquiryNote = async ({
  inquiryId,
  data,
}: {
  inquiryId: number;
  data: InquiryNoteCreate;
}): Promise<InquiryNote> => {
  const response = await api.post(`/inquiries/${inquiryId}/notes/`, data);
  return response.data;
};

const updateInquiryNote = async ({
  noteId,
  data,
}: {
  noteId: number;
  data: InquiryNoteUpdate;
}): Promise<InquiryNote> => {
  const response = await api.put(`/inquiries/notes/${noteId}/`, data);
  return response.data;
};

const deleteInquiryNote = async (noteId: number): Promise<void> => {
  await api.delete(`/inquiries/notes/${noteId}/`);
};

// Mutation hooks
export const useCreateInquiryNoteMutation = createMutation<
  InquiryNote,
  { inquiryId: number; data: InquiryNoteCreate }
>({
  mutationFn: createInquiryNote,
  invalidateKeys: ['inquiries'],
  onSuccessMessage: 'Qeyd uğurla əlavə edildi!',
  onErrorMessage: 'Qeyd əlavə etmək alınmadı',
});

export const useUpdateInquiryNoteMutation = createMutation<
  InquiryNote,
  { noteId: number; data: InquiryNoteUpdate }
>({
  mutationFn: updateInquiryNote,
  invalidateKeys: ['inquiries'],
  onSuccessMessage: 'Qeyd uğurla yeniləndi!',
  onErrorMessage: 'Qeyd yeniləmək alınmadı',
});

export const useDeleteInquiryNoteMutation = createMutation<void, number>({
  mutationFn: deleteInquiryNote,
  invalidateKeys: ['inquiries'],
  onSuccessMessage: 'Qeyd uğurla silindi!',
  onErrorMessage: 'Qeyd silmək alınmadı',
});
