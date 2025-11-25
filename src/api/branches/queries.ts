import { createQuery } from "../../config";
import api from "../../config/api";
import type { PaginatedResponse } from "../types";
import type { Branch, BranchListParams } from "./types";

// API functions
const fetchBranches = async (
	params?: BranchListParams,
): Promise<PaginatedResponse<Branch>> => {
	const response = await api.get("/branches/", { params });
	return response.data;
};

const fetchBranch = async (id: number): Promise<Branch> => {
	const response = await api.get(`/branches/${id}/`);
	return response.data;
};

const fetchBranchUsers = async (id: number): Promise<any[]> => {
	const response = await api.get(`/branches/${id}/users/`);
	return response.data;
};

// Query hooks
export const useBranchesQuery = (params?: BranchListParams) => {
	return createQuery<PaginatedResponse<Branch>>({
		queryKey: ["branches", "list", JSON.stringify(params)],
		queryFn: () => fetchBranches(params),
	})();
};

export const useBranchQuery = (id: number) => {
	return createQuery<Branch>({
		queryKey: ["branches", "detail", id],
		queryFn: () => fetchBranch(id),
		options: {
			enabled: !!id,
		},
	})();
};

export const useBranchUsersQuery = (id: number) => {
	return createQuery<any[]>({
		queryKey: ["branches", "users", id],
		queryFn: () => fetchBranchUsers(id),
		options: {
			enabled: !!id,
		},
	})();
};
