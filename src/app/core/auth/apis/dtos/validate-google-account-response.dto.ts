export interface ValidateGoogleAccountResponse {
	provider: string;
	providerKey: string;
	email: string;
	emailVerified: boolean;
	isUserExists: boolean;
}
