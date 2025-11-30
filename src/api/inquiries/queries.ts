import { createQuery } from '../../config';
import api from '../../config/api';
import type { Inquiry, InquiryListParams } from './types';

// API functions
const fetchInquiries = async (params?: InquiryListParams): Promise<Inquiry[]> => {
  const response = await api.get('/inquiries/', { params });
  return response.data;
};

const fetchInquiry = async (id: number): Promise<Inquiry> => {
  const response = await api.get(`/inquiries/${id}/`);
  return response.data;
};

const fetchFollowUpInquiries = async (): Promise<Inquiry[]> => {
  const response = await api.get('/inquiries/follow_ups/');
  return response.data;
};

// Query hooks
export const useInquiriesQuery = (params?: InquiryListParams) => {
  return createQuery<Inquiry[]>({
    queryKey: ['inquiries', 'list', params],
    queryFn: () => fetchInquiries(params),
  })();
};

export const useInquiryQuery = (id: number) => {
  return createQuery<Inquiry>({
    queryKey: ['inquiries', 'detail', id],
    queryFn: () => fetchInquiry(id),
    options: {
      enabled: !!id,
    },
  })();
};

export const useFollowUpInquiriesQuery = () => {
  return createQuery<Inquiry[]>({
    queryKey: ['inquiries', 'follow-ups'],
    queryFn: fetchFollowUpInquiries,
  })();
};
