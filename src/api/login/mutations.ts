import { createMutation } from '../../config';
import api from '../../config/api';
import type { LoginRequest, LoginResponse, MessageResponse } from './types';

export const authAPIMutations = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post('/auth/login/', credentials);
      console.log('Login response:', response);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async (): Promise<MessageResponse> => {
    try {
      const response = await api.post('/auth/logout/');
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
};

export const useLoginMutation = createMutation<LoginResponse, LoginRequest>({
  mutationFn: (credentials) => authAPIMutations.login(credentials),
  invalidateKeys: [],
  onSuccessMessage: 'Giriş uğurlu oldu!',
  onErrorMessage: (
    error: Error & { response?: { data?: { detail?: string } } }
  ) => error.response?.data?.detail || 'Giriş zamanı xəta baş verdi',
  // Note: Navigation is handled in the component using useNavigate
});

export const useLogoutMutation = createMutation<MessageResponse, void>({
  mutationFn: () => authAPIMutations.logout(),
  invalidateKeys: [],
  onSuccessMessage: 'Çıxış uğurlu oldu!',
  onErrorMessage: 'Çıxış zamanı xəta baş verdi',
  // Note: Navigation is handled in the component using useNavigate
});
