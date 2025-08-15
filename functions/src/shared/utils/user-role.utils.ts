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

export function listBelowOrEqualUserRoles(role?: UserRoleEnum): UserRoleEnum[] {
	if (!role) {
		return [];
	}

	const roles = Object.values(UserRoleEnum);
	const roleIndex = roles.indexOf(role);
	if (roleIndex === -1) {
		return [];
	}
	return roles.slice(roleIndex, roles.length - 1);
}

export function listBelowUserRoles(role?: UserRoleEnum): UserRoleEnum[] {
	if (!role) {
		return [];
	}
	const roles = Object.values(UserRoleEnum);
	const roleIndex = roles.indexOf(role) + 1;
	if (roleIndex === -1 || roleIndex >= roles.length) {
		return [];
	}
	return roles.slice(roleIndex, roles.length - 1);
}

export function isUserRoleEqualOrHigher(roleRequired: UserRoleEnum, role?: UserRoleEnum): boolean {
	if (!role) {
		return false;
	}

	const roles = Object.values(UserRoleEnum);
	const roleIndex = roles.indexOf(role);
	const requiredRoleIndex = roles.indexOf(roleRequired);
	return roleIndex !== -1 && requiredRoleIndex !== -1 && roleIndex <= requiredRoleIndex;
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
