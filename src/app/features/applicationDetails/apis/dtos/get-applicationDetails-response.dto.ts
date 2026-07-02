export interface ApplicationDocument {
	id: string;
	name: string;
	media: {
		id: string;
		contentType: string;
		fileName: string;
		createdAt: string;
	};
	status: number;
	submittedOnUtc: string;
}

export interface GetApplicationDetailResponse {
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


export interface LegalPaperFileResponse {
	content: string;      // base64
	contentType: string;
	fileName: string;
}