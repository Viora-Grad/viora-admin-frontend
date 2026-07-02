export interface GetOrganizationsRequest {
	id?: string;
	country?: string;
	name?: string;
	serviceType?: string;
	minimumRating: number;
	sortBy:number;
	page:number;
	pageSize: number;
}
