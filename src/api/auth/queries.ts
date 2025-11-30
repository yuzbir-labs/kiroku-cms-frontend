import { createQuery } from 'config';
import api from 'config/api';
import type { CSRFTokenResponse, User } from './types';

// API functions
const fetchCurrentUser = async (): Promise<User> => {
  const response = await api.get('/auth/me/');
  return response.data;
};

const fetchCSRFToken = async (): Promise<CSRFTokenResponse> => {
  const response = await api.get('/auth/csrf/');
  return response.data;
};

// Query hooks
export const useCurrentUserQuery = () => {
  return createQuery<User>({
    queryKey: ['auth', 'me'],
    queryFn: fetchCurrentUser,
    options: {
      retry: false,
    },
  })();
};

export const useCSRFTokenQuery = () => {
  return createQuery<CSRFTokenResponse>({
    queryKey: ['auth', 'csrf'],
    queryFn: fetchCSRFToken,
  })();
};
