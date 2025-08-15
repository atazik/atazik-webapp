import { UserRoleEnum } from "../enums/user-roles.enum";

export function getUserRoleLabel(role?: string): string {
	switch (role) {
		case UserRoleEnum.ADMIN:
			return "Administrateur";
		case UserRoleEnum.PRESIDENT:
			return "Président";
		case UserRoleEnum.RESPONSABLE:
			return "Responsable";
		case UserRoleEnum.MEMBER:
			return "Membre";
		case UserRoleEnum.USER:
			return "Utilisateur";
		default:
			return "Rôle inconnu";
	}
}

export function listBelowOrEqualUserRoles(role: UserRoleEnum): UserRoleEnum[] {
	const roles = Object.values(UserRoleEnum);
	const roleIndex = roles.indexOf(role);
	if (roleIndex === -1) {
		return [];
	}
	return roles.slice(0, roleIndex + 1);
}

export function isUserRoleEqualOrBelow(role: UserRoleEnum, compareRole: UserRoleEnum): boolean {
	const roles = Object.values(UserRoleEnum);
	const roleIndex = roles.indexOf(role);
	const compareRoleIndex = roles.indexOf(compareRole);
	return roleIndex !== -1 && compareRoleIndex !== -1 && roleIndex <= compareRoleIndex;
}

export function listUserRolesWithLabel(roleList?: UserRoleEnum[]): { label: string; value: string }[] {
	if (!roleList) {
		roleList = Object.values(UserRoleEnum);
	}

	return roleList.map((role) => ({
		label: getUserRoleLabel(role),
		value: role,
	}));
}
