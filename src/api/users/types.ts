import type { UserType } from "../auth/types";

export interface UserListParams {
	search?: string;
	user_type?: UserType;
	is_active?: boolean;
	branch?: string; // Comma-separated branch IDs (e.g., "1,2,3")
	page?: number;
	page_size?: number;
}

export interface UserListParamsInternal {
	search?: string;
	user_type?: UserType;
	is_active?: boolean;
	branches?: number[]; // Used for create/update operations
	page?: number;
	page_size?: number;
}

export interface UserCreate {
	email: string;
	first_name: string;
	last_name: string;
	user_type: UserType;
	phone_number?: string | null;
	date_of_birth?: string | null;
	address?: string | null;
	profile_picture?: string | null;
	branches?: number[];
	is_active?: boolean;
}

export interface UserUpdate {
	email?: string;
	first_name?: string;
	last_name?: string;
	user_type?: UserType;
	phone_number?: string | null;
	date_of_birth?: string | null;
	address?: string | null;
	profile_picture?: string | null;
	branches?: number[];
	is_active?: boolean;
}
