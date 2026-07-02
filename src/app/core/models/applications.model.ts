export interface Application {
	id: string;
	ownerId: string;
	ownerName: string;
	name: string;
	about: string;
	letter: string;
	serviceDescription: string;
	servicesProvided: string[];
	submittedOnUtc: string;
	status: string;
	referralSource: string;
	rejectedById: string | null;
	rejectedByName: string | null;
	expiryDateUtc: string;
	billingEmail: string;
	supportEmail: string;
	articleOfAssociation: ApplicationDocument;
	commercialRegistration: ApplicationDocument;
	registeredAddressProof: ApplicationDocument;
	taxCard: ApplicationDocument;
}

export interface ApplicationDocument {
	id: string;
	name: string;
	media: Media;
	actionBy: AdminAction;
	status: number;
	submittedOnUtc: string;
	expiryDateUtc: string;
}

export interface Media {
	id: string;
	contentType: string;
	fileName: string;
	createdAt: string;
}

export interface AdminAction {
	adminId: string;
	name: string;
}