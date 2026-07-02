export interface Organization {
	id: string;
	logoId: string | null;
	name: string;
	country: string;
	serviceDescription: string;
	servicesProvided: string[];
	ratingsCount: string;
	ratingOutOfTen: string;
}