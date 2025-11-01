import { createQuery } from '../../config';
import api from '../../config/api';
import type { DashboardStats } from './types';

export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats/');
    return response.data;
  },
};

export const useDashboardStatsQuery = () =>
  createQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: () => dashboardAPI.getStats(),
  })();
