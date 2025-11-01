import { createQuery } from '../../config';
import api from '../../config/api';
import type { PaginatedBranchesResponse } from './types';

const fetchBranches = async (
  page: number = 1,
  search?: string,
  activeToBotFilter?: boolean,
  isActiveFilter?: boolean,
  mpPriceBelowMinFilter?: boolean,
  pageSize: number = 10,
  ordering?: string
): Promise<PaginatedBranchesResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
  });

  if (search) {
    params.append('search', search);
  }

  if (activeToBotFilter !== undefined) {
    params.append('active_to_bot', activeToBotFilter.toString());
  }

  if (isActiveFilter !== undefined) {
    params.append('is_active', isActiveFilter.toString());
  }

  if (mpPriceBelowMinFilter !== undefined) {
    params.append(
      'mp_price_is_below_min_price',
      mpPriceBelowMinFilter.toString()
    );
  }

  if (ordering) {
    params.append('ordering', ordering);
  }

  const response = await api.get(`/products/?${params.toString()}`);
  return response.data;
};

export const useBranchesQuery = (
  page: number = 1,
  search?: string,
  activeToBotFilter?: boolean,
  isActiveFilter?: boolean,
  mpPriceBelowMinFilter?: boolean,
  pageSize: number = 10,
  ordering?: string
) => {
  return createQuery<PaginatedBranchesResponse>({
    queryKey: [
      'branches',
      page,
      pageSize,
      search,
      activeToBotFilter,
      isActiveFilter,
      mpPriceBelowMinFilter,
      ordering,
    ],
    queryFn: () =>
      fetchBranches(
        page,
        search,
        activeToBotFilter,
        isActiveFilter,
        mpPriceBelowMinFilter,
        pageSize,
        ordering
      ),
  })();
};
