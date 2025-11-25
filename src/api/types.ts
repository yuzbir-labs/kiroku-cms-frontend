/**
 * Common types shared across API modules
 */

/**
 * Paginated response structure from Django REST Framework
 */
export interface PaginatedResponse<T> {
	count: number;
	next: string | null;
	previous: string | null;
	results: T[];
}

/**
 * Pagination parameters for API requests
 */
export interface PaginationParams {
	page?: number;
	page_size?: number;
}
