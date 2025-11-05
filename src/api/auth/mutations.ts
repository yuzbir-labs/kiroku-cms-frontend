import { createMutation } from '../../config';
import api from '../../config/api';
import type {
  LoginRequest,
  LoginResponse,
  MessageResponse,
  PasswordChangeRequest,
  PasswordResetRequest,
  PasswordResetConfirm,
  TokenVerify,
  ProfileUpdateRequest,
  User,
} from './types';

// API functions
const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post('/auth/login/', credentials);
  return response.data;
};

const logout = async (): Promise<MessageResponse> => {
  const response = await api.post('/auth/logout/', {});
  return response.data;
};

const changePassword = async (
  data: PasswordChangeRequest
): Promise<MessageResponse> => {
  const response = await api.post('/auth/password/change/', data);
  return response.data;
};

const requestPasswordReset = async (
  data: PasswordResetRequest
): Promise<MessageResponse> => {
  const response = await api.post('/auth/password-reset/request/', data);
  return response.data;
};

const verifyPasswordResetToken = async (
  data: TokenVerify
): Promise<MessageResponse> => {
  const response = await api.post('/auth/password-reset/verify/', data);
  return response.data;
};

const confirmPasswordReset = async (
  data: PasswordResetConfirm
): Promise<MessageResponse> => {
  const response = await api.post('/auth/password-reset/confirm/', data);
  return response.data;
};

const updateProfile = async (data: ProfileUpdateRequest): Promise<User> => {
  const response = await api.patch('/auth/profile/update/', data);
  return response.data;
};

// Mutation hooks
export const useLoginMutation = createMutation<LoginResponse, LoginRequest>({
  mutationFn: login,
  invalidateKeys: ['auth'],
  onSuccessMessage: 'Giriş uğurlu oldu!',
  onErrorMessage: (error: unknown) => {
    const err = error as Error & { response?: { data?: { detail?: string } } };
    return err.response?.data?.detail || 'Giriş zamanı xəta baş verdi';
  },
});

export const useLogoutMutation = createMutation<MessageResponse, void>({
  mutationFn: logout,
  invalidateKeys: ['auth'], // Invalidate auth cache on logout
  onSuccessMessage: 'Çıxış uğurlu oldu!',
  onErrorMessage: 'Çıxış zamanı xəta baş verdi',
});

export const useChangePasswordMutation = createMutation<
  MessageResponse,
  PasswordChangeRequest
>({
  mutationFn: changePassword,
  invalidateKeys: [],
  onSuccessMessage: 'Şifrə uğurla dəyişdirildi!',
  onErrorMessage: 'Şifrə dəyişdirmək alınmadı',
});

export const useRequestPasswordResetMutation = createMutation<
  MessageResponse,
  PasswordResetRequest
>({
  mutationFn: requestPasswordReset,
  invalidateKeys: [],
  onSuccessMessage: 'Şifrə sıfırlama emaili göndərildi!',
  onErrorMessage: 'Email göndərmək alınmadı',
});

export const useVerifyPasswordResetTokenMutation = createMutation<
  MessageResponse,
  TokenVerify
>({
  mutationFn: verifyPasswordResetToken,
  invalidateKeys: [],
  onSuccessMessage: 'Token doğrulandı!',
  onErrorMessage: 'Token doğrulamaq alınmadı',
});

export const useConfirmPasswordResetMutation = createMutation<
  MessageResponse,
  PasswordResetConfirm
>({
  mutationFn: confirmPasswordReset,
  invalidateKeys: [],
  onSuccessMessage: 'Şifrə uğurla sıfırlandı!',
  onErrorMessage: 'Şifrə sıfırlamaq alınmadı',
});

export const useUpdateProfileMutation = createMutation<
  User,
  ProfileUpdateRequest
>({
  mutationFn: updateProfile,
  invalidateKeys: ['auth'],
  onSuccessMessage: 'Profil uğurla yeniləndi!',
  onErrorMessage: 'Profil yeniləmək alınmadı',
});
