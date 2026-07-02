import { Gender } from './gender.enum';
import { Role } from './role.enum';

export interface User {
	id: string;
	firstName: string;
	lastName: string;
	dateOfBirth: Date;
	gender: Gender;
	email: string;
	role: Role;
}
