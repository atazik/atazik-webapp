"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRoleLabel = getUserRoleLabel;
exports.listBelowOrEqualUserRoles = listBelowOrEqualUserRoles;
exports.listBelowUserRoles = listBelowUserRoles;
exports.isUserRoleEqualOrHigher = isUserRoleEqualOrHigher;
exports.listUserRolesWithLabel = listUserRolesWithLabel;
const user_roles_enum_1 = require("../enums/user-roles.enum");
function getUserRoleLabel(role) {
    switch (role) {
        case user_roles_enum_1.UserRoleEnum.ADMIN:
            return "Administrateur";
        case user_roles_enum_1.UserRoleEnum.PRESIDENT:
            return "Président";
        case user_roles_enum_1.UserRoleEnum.RESPONSABLE:
            return "Responsable";
        case user_roles_enum_1.UserRoleEnum.MEMBER:
            return "Membre";
        case user_roles_enum_1.UserRoleEnum.USER:
            return "Utilisateur";
        default:
            return "Rôle inconnu";
    }
}
function listBelowOrEqualUserRoles(role) {
    if (!role) {
        return [];
    }
    const roles = Object.values(user_roles_enum_1.UserRoleEnum);
    const roleIndex = roles.indexOf(role);
    if (roleIndex === -1) {
        return [];
    }
    return roles.slice(roleIndex, roles.length - 1);
}
function listBelowUserRoles(role) {
    if (!role) {
        return [];
    }
    const roles = Object.values(user_roles_enum_1.UserRoleEnum);
    const roleIndex = roles.indexOf(role) + 1;
    if (roleIndex === -1 || roleIndex >= roles.length) {
        return [];
    }
    return roles.slice(roleIndex, roles.length - 1);
}
function isUserRoleEqualOrHigher(roleRequired, role) {
    if (!role) {
        return false;
    }
    const roles = Object.values(user_roles_enum_1.UserRoleEnum);
    const roleIndex = roles.indexOf(role);
    const requiredRoleIndex = roles.indexOf(roleRequired);
    return roleIndex !== -1 && requiredRoleIndex !== -1 && roleIndex <= requiredRoleIndex;
}
function listUserRolesWithLabel(roleList) {
    if (!roleList) {
        roleList = Object.values(user_roles_enum_1.UserRoleEnum);
    }
    return roleList.map((role) => ({
        label: getUserRoleLabel(role),
        value: role,
    }));
}
//# sourceMappingURL=user-role.utils.js.map