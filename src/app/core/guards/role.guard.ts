import { CanActivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { RoleService } from "../services/role.service";
import { isUserRoleEqualOrHigher } from "@shared/utils/user-role.utils";
import { UserRoleEnum } from "@shared/enums/user-roles.enum";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const roleGuard: CanActivateFn = (route, state) => {
	const requiredRole = route.data["role"] as UserRoleEnum;
	const role = inject(RoleService).role();
	return isUserRoleEqualOrHigher(requiredRole, role);
};
