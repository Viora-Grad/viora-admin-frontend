import { User } from '../../../models/user.model';

export interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	user: User;
}
