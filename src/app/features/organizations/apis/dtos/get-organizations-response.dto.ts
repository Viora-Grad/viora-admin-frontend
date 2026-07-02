import { Organization } from '../../../../core/models/organization.model';

export interface GetOrganizationsResponse {
	items: Organization[];
	page: number;
	pageSize: number;
	totalCount: number;
	count: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	nextPage: number;
	previousPage: number;
}
