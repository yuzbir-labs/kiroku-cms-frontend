import { createQuery } from 'config';
import api from 'config/api';
import type { User } from '../auth/types';
import type { PaginatedResponse } from '../types';
import type { UserListParams } from './types';

// API functions
const fetchUsers = async (params?: UserListParams): Promise<PaginatedResponse<User>> => {
  const response = await api.get('/users/', { params });
  return response.data;
};

const fetchUser = async (id: number): Promise<User> => {
  const response = await api.get(`/users/${id}/`);
  return response.data;
};

// Query hooks
export const useUsersQuery = (params?: UserListParams) => {
  return createQuery<PaginatedResponse<User>>({
    queryKey: ['users', 'list', JSON.stringify(params)],
    queryFn: () => fetchUsers(params),
  })();
};

export const useUserQuery = (id: number) => {
  return createQuery<User>({
    queryKey: ['users', 'detail', id],
    queryFn: () => fetchUser(id),
    options: {
      enabled: !!id,
    },
  })();
};
