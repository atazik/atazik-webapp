/**
 * Enum representing different user roles in the application.
 * This enum is used to define the roles that users can have,
 * which can be used for access control and permissions.
 */
export enum UserRoleEnum {
	ADMIN = "admin",
	PRESIDENT = "president",
	MEMBER = "member",
	USER = "user",
}

// TODO Move in services ?
export function getUserRoleLabel(role?: string): string {
	console.log("getUserRoleLabel", role);
	switch (role) {
		case UserRoleEnum.ADMIN:
			return "Administrateur";
		case UserRoleEnum.PRESIDENT:
			return "Président";
		case UserRoleEnum.MEMBER:
			return "Membre";
		case UserRoleEnum.USER:
			return "Utilisateur";
		default:
			return "Rôle inconnu";
	}
}

// TODO Move in services ?
export function listBelowUserRoles(role: UserRoleEnum): UserRoleEnum[] {
	const roles = Object.values(UserRoleEnum);
	const index = roles.indexOf(role);
	if (index === -1) {
		return [];
	}
	return roles.slice(index + 1);
}

// TODO Move in services ?
export function isUserRoleEqualOrBelow(role: UserRoleEnum, compareRole: UserRoleEnum): boolean {
	const roles = Object.values(UserRoleEnum);
	const roleIndex = roles.indexOf(role);
	const compareRoleIndex = roles.indexOf(compareRole);
	return roleIndex !== -1 && compareRoleIndex !== -1 && roleIndex <= compareRoleIndex;
}

export function listUserRolesWithLabel(): { label: string; value: string }[] {
	return Object.values(UserRoleEnum).map((role) => ({
		label: getUserRoleLabel(role),
		value: role,
	}));
}
