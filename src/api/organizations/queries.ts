import { createQuery } from '../../config';
import api from '../../config/api';
import type {
  Organization,
  OrganizationListParams,
  OrganizationStatistics,
  OrganizationBranch,
} from './types';

// API functions
const fetchOrganizations = async (
  params?: OrganizationListParams
): Promise<Organization[]> => {
  const response = await api.get('/organizations/', { params });
  return response.data;
};

const fetchOrganization = async (): Promise<Organization> => {
  const response = await api.get(`/organizations/my/`);
  return response.data;
};

const fetchOrganizationBranches = async (): Promise<OrganizationBranch[]> => {
  const response = await api.get('/organizations/my/branches/');
  return response.data;
};

const fetchOrganizationStatistics =
  async (): Promise<OrganizationStatistics> => {
    const response = await api.get(`/organizations/my/statistics/`);
    return response.data;
  };

// Query hooks
export const useOrganizationsQuery = (params?: OrganizationListParams) => {
  return createQuery<Organization[]>({
    queryKey: ['organizations', 'list', JSON.stringify(params)],
    queryFn: () => fetchOrganizations(params),
  })();
};

export const useOrganizationQuery = () => {
  return createQuery<Organization>({
    queryKey: ['organizations', 'detail'],
    queryFn: () => fetchOrganization(),
    options: {
      enabled: true,
    },
  })();
};

export const useOrganizationBranchesQuery = () => {
  return createQuery<OrganizationBranch[]>({
    queryKey: ['organizations', 'branches'],
    queryFn: fetchOrganizationBranches,
  })();
};

export const useOrganizationStatisticsQuery = () => {
  return createQuery<OrganizationStatistics>({
    queryKey: ['organizations', 'statistics'],
    queryFn: () => fetchOrganizationStatistics(),
    options: {
      enabled: true,
    },
  })();
};
