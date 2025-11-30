import { createMutation } from 'config';
import api from 'config/api';
import type { Payment, PaymentCreate, PaymentUpdate } from './types';

// API functions
const createPayment = async (data: PaymentCreate): Promise<Payment> => {
  const response = await api.post('/payments/payments/', data);
  return response.data;
};

const updatePayment = async ({
  id,
  data,
}: {
  id: number;
  data: PaymentUpdate;
}): Promise<Payment> => {
  const response = await api.put(`/payments/payments/${id}/`, data);
  return response.data;
};

const partialUpdatePayment = async ({
  id,
  data,
}: {
  id: number;
  data: PaymentUpdate;
}): Promise<Payment> => {
  const response = await api.patch(`/payments/payments/${id}/`, data);
  return response.data;
};

const deletePayment = async (id: number): Promise<void> => {
  await api.delete(`/payments/payments/${id}/`);
};

// Mutation hooks
export const useCreatePaymentMutation = createMutation<Payment, PaymentCreate>({
  mutationFn: createPayment,
  invalidateKeys: ['payments'],
  onSuccessMessage: 'Ödəniş uğurla əlavə edildi!',
  onErrorMessage: 'Ödəniş əlavə etmək alınmadı',
});

export const useUpdatePaymentMutation = createMutation<
  Payment,
  { id: number; data: PaymentUpdate }
>({
  mutationFn: updatePayment,
  invalidateKeys: ['payments'],
  onSuccessMessage: 'Ödəniş uğurla yeniləndi!',
  onErrorMessage: 'Ödəniş yeniləmək alınmadı',
});

export const usePartialUpdatePaymentMutation = createMutation<
  Payment,
  { id: number; data: PaymentUpdate }
>({
  mutationFn: partialUpdatePayment,
  invalidateKeys: ['payments'],
  onSuccessMessage: 'Ödəniş uğurla yeniləndi!',
  onErrorMessage: 'Ödəniş yeniləmək alınmadı',
});

export const useDeletePaymentMutation = createMutation<void, number>({
  mutationFn: deletePayment,
  invalidateKeys: ['payments'],
  onSuccessMessage: 'Ödəniş uğurla silindi!',
  onErrorMessage: 'Ödəniş silmək alınmadı',
});
