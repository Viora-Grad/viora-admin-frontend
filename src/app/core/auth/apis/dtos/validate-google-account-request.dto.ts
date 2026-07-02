export interface ValidateGoogleAccountRequest {
	isCode: true;
	code: string;
	redirectUri: string;
}
