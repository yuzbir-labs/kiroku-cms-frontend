import { createQuery } from 'config';
import api from 'config/api';
import type { InquiryNote } from './types';

// API functions
const fetchInquiryNotes = async (inquiryId: number): Promise<InquiryNote[]> => {
  const response = await api.get(`/inquiries/${inquiryId}/notes/`);
  return response.data;
};

const fetchInquiryNote = async (noteId: number): Promise<InquiryNote> => {
  const response = await api.get(`/inquiries/notes/${noteId}/`);
  return response.data;
};

// Query hooks
export const useInquiryNotesQuery = (inquiryId: number) => {
  return createQuery<InquiryNote[]>({
    queryKey: ['inquiries', 'notes', inquiryId],
    queryFn: () => fetchInquiryNotes(inquiryId),
    options: {
      enabled: !!inquiryId,
    },
  })();
};

export const useInquiryNoteQuery = (noteId: number) => {
  return createQuery<InquiryNote>({
    queryKey: ['inquiries', 'notes', 'detail', noteId],
    queryFn: () => fetchInquiryNote(noteId),
    options: {
      enabled: !!noteId,
    },
  })();
};
