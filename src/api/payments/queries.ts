import { createQuery } from 'config';
import api from 'config/api';
import type { Payment, PaymentListParams } from './types';

// API functions
const fetchPayments = async (
  params?: PaymentListParams
): Promise<{ results: Payment[]; count: number }> => {
  const response = await api.get('/payments/payments/', { params });
  return response.data;
};

const fetchPayment = async (id: number): Promise<Payment> => {
  const response = await api.get(`/payments/payments/${id}/`);
  return response.data;
};

// Query hooks
export const usePaymentsQuery = (params?: PaymentListParams) => {
  return createQuery<{ results: Payment[]; count: number }>({
    queryKey: ['payments', 'list', JSON.stringify(params || {})],
    queryFn: () => fetchPayments(params),
  })();
};

export const usePaymentQuery = (id: number) => {
  return createQuery<Payment>({
    queryKey: ['payments', 'detail', id],
    queryFn: () => fetchPayment(id),
    options: {
      enabled: !!id,
    },
  })();
};

// Helper hook: fetch payments by enrollment
export const usePaymentsByEnrollmentQuery = (
  enrollmentId: number,
  params?: Omit<PaymentListParams, 'enrollment'>
) => {
  return createQuery<{ results: Payment[]; count: number }>({
    queryKey: ['payments', 'by-enrollment', enrollmentId, JSON.stringify(params || {})],
    queryFn: () => fetchPayments({ ...params, enrollment: enrollmentId }),
    options: {
      enabled: !!enrollmentId,
    },
  })();
};

// Helper hook: fetch payments by course group
export const usePaymentsByCourseGroupQuery = (
  courseGroupId: number,
  params?: Omit<PaymentListParams, 'enrollment__course_group'>
) => {
  return createQuery<{ results: Payment[]; count: number }>({
    queryKey: ['payments', 'by-course-group', courseGroupId, JSON.stringify(params || {})],
    queryFn: () => fetchPayments({ ...params, enrollment__course_group: courseGroupId }),
    options: {
      enabled: !!courseGroupId,
    },
  })();
};
