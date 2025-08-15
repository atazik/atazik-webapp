export interface UserInvite {
	uid?: string;
	email: string;
	role?: string;
	createdAt?: Date;
	expiresAt?: Date;
}
