import { createQuery } from '../../config';
import api from '../../config/api';
import type { User, CSRFTokenResponse } from './types';

export const authAPI = {
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me/');
    return response.data;
  },

  getCSRFToken: async (): Promise<CSRFTokenResponse> => {
    const response = await api.get('/auth/csrf/');
    return response.data;
  },

  getUsersList: async (): Promise<CSRFTokenResponse> => {
    const response = await api.get('/users/');
    return response.data;
  },
};

export const useCurrentUserQuery = () =>
  createQuery<User>({
    queryKey: ['currentUser'],
    queryFn: () => authAPI.getCurrentUser(),
    options: {
      retry: false,
      // Cookie-based auth - always try to fetch user if on authenticated page
    },
  })();

export const useCSRFTokenQuery = () =>
  createQuery<CSRFTokenResponse>({
    queryKey: ['csrfToken'],
    queryFn: () => authAPI.getCSRFToken(),
  })();

export const useUsersListQuery = () =>
  createQuery<CSRFTokenResponse>({
    queryKey: ['usersList'],
    queryFn: () => authAPI.getUsersList(),
  })();