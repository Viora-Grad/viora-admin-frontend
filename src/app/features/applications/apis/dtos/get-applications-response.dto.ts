import { Application } from '../../../../core/models/applications.model';

export interface GetApplicationsResponse {
	items: Application[];
	page: number;
	pageSize: number;
	totalCount: number;
	count: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	nextPage: number | null;
	previousPage: number | null;
}


