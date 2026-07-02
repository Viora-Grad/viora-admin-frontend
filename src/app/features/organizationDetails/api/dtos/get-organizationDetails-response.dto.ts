export interface OrganizationBranch {
	id: string;
	imageId: string | null;
	address: string;
	openedSinceUtc: string;
}

export interface GetOrganizationDetailResponse {
	id: string;
	name: string;
	about: string;
	country: string;
	countryCode: string;
	servicesProvided: string[];
	serviceDescription: string;
	contactEmail: string;
	joinedOnUtc: string;
	branches: OrganizationBranch[];
}
