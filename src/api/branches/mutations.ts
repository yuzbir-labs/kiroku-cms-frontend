import { createMutation } from '../../config';
import api from '../../config/api';
import type {
  Branch,
  UpdateMinPricePayload,
  ToggleActivePayload,
  ActivateProductPayload,
  DeactivateProductPayload,
  ActivateAllResponse,
} from './types';

// API functions
const updateMinPrice = async (
  payload: UpdateMinPricePayload
): Promise<Branch> => {
  const response = await api.patch(`/products/${payload.productId}/update/`, {
    min_price: payload.minPrice,
  });
  return response.data;
};

const toggleActive = async (payload: ToggleActivePayload): Promise<Branch> => {
  const response = await api.patch(`/products/${payload.productId}/update/`, {
    active_to_bot: payload.active,
  });
  return response.data;
};

const fetchUmico = async (): Promise<void> => {
  const response = await api.post(`/products/fetch-umico/`);
  if (response.status === 202 || response.status === 200) {
    return;
  }
  throw new Error(`Unexpected status code: ${response.status}`);
};

const activateAll = async (): Promise<ActivateAllResponse> => {
  const response = await api.post(`/products/activate-all/`);
  return response.data;
};

const activateProduct = async (
  payload: ActivateProductPayload
): Promise<void> => {
  const response = await api.post(`/products/activate/`, payload);
  return response.data;
};

const deactivateProduct = async (
  payload: DeactivateProductPayload
): Promise<void> => {
  const response = await api.post(`/products/deactivate/`, payload);
  return response.data;
};

// Mutation hooks
export const useUpdateMinPriceMutation = createMutation<
  Branch,
  UpdateMinPricePayload
>({
  mutationFn: updateMinPrice,
  invalidateKeys: ['branches'],
  onSuccessMessage: 'Minimum qiymət uğurla yeniləndi!',
  onErrorMessage: (error) => `Yeniləmək alınmadı: ${error.message}`,
});

export const useToggleActiveMutation = createMutation<
  Branch,
  ToggleActivePayload
>({
  mutationFn: toggleActive,
  invalidateKeys: ['branches'],
  onSuccessMessage: (data) =>
    `Uğurla ${data.active_to_bot ? 'aktiv edildi' : 'deaktiv edildi'}!`,
  onErrorMessage: (error) => `Statusunu dəyişmək alınmadı: ${error.message}`,
});

export const useFetchUmicoMutation = createMutation<void, void>({
  mutationFn: fetchUmico,
  invalidateKeys: [],
  onSuccessMessage: 'Umico məlumatları uğurla yeniləndi!',
  onErrorMessage: (error) => `Yeniləmək alınmadı: ${error.message}`,
  onSuccessCallback: () => {
    // Delayed invalidation for Umico fetch
    setTimeout(() => {
      // This will be handled by the component
    }, 2000);
  },
});

export const useActivateAllMutation = createMutation<ActivateAllResponse, void>(
  {
    mutationFn: activateAll,
    invalidateKeys: ['branches'],
    onSuccessMessage: (data) =>
      `${data.activated_count} element uğurla aktiv edildi!`,
    onErrorMessage: (error) => `Aktiv etmək alınmadı: ${error.message}`,
  }
);

export const useActivateProductMutation = createMutation<
  void,
  ActivateProductPayload
>({
  mutationFn: activateProduct,
  invalidateKeys: ['branches'],
  onSuccessMessage: 'Uğurla aktiv edildi!',
  onErrorMessage: (error) => `Aktiv etmək alınmadı: ${error.message}`,
});

export const useDeactivateProductMutation = createMutation<
  void,
  DeactivateProductPayload
>({
  mutationFn: deactivateProduct,
  invalidateKeys: ['branches'],
  onSuccessMessage: 'Uğurla deaktiv edildi!',
  onErrorMessage: (error) => `Deaktiv etmək alınmadı: ${error.message}`,
});
