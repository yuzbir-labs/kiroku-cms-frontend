export interface Branch {
	id: number;
	name: string;
	code: string;
	address: string;
	city: string;
	state: string | null;
	country: string;
	postal_code: string | null;
	phone_number: string;
	email: string;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface BranchCreate {
	name: string;
	code: string;
	address: string;
	city: string;
	state?: string | null;
	country: string;
	postal_code?: string | null;
	phone_number: string;
	email: string;
	is_active?: boolean;
}

export interface BranchUpdate {
	name?: string;
	code?: string;
	address?: string;
	city?: string;
	state?: string | null;
	country?: string;
	postal_code?: string | null;
	phone_number?: string;
	email?: string;
	is_active?: boolean;
}

export interface BranchListParams {
	search?: string;
	is_active?: boolean;
	city?: string;
	country?: string;
	page?: number;
	page_size?: number;
}
