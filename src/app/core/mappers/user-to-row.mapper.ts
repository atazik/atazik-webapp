import { PartialFirebaseUser } from "../models/firebase-user.model";
import { FirebaseUserRow } from "../models/tables-row/firebase-user-row.model";
import { UserInvite } from "../models/user-invite.model";
import { getUserRoleLabel } from "../enums/user-roles.enum";

export function mapFirebaseUserToRow(user: PartialFirebaseUser): FirebaseUserRow {
	const { email, displayName, emailVerified, customClaims } = user;
	const statusActivated = emailVerified && customClaims?.["status"] === "activated";

	return {
		displayName: displayName || "Aucun nom défini",
		email: email || "Aucun e-mail défini",
		statusChip: {
			label: getStatusLabel(customClaims?.["status"], emailVerified),
			icon: statusActivated ? "pi pi-check" : "pi pi-times",
			class: statusActivated ? "bg-green text-white" : !emailVerified ? "bg-yellow text-white" : "bg-gray text-white",
		},
		roleChip: {
			label: getUserRoleLabel(customClaims!["role"]),
			icon: customClaims?.["role"] === "admin" ? "pi pi-shield" : "pi pi-user",
			class: customClaims?.["role"] === "admin" ? "bg-red text-white" : "bg-gray text-white",
		},
	};
}

export function mapFirebaseUsersToRows(user: PartialFirebaseUser[]): FirebaseUserRow[] {
	return user.map(mapFirebaseUserToRow);
}

export function mapUserInviteToRow(invite: UserInvite): FirebaseUserRow {
	const { email, role } = invite;

	return {
		displayName: "Invitation en attente",
		email: email || "Aucun e-mail défini",
		statusChip: {
			label: "Invité",
			icon: "pi pi-clock",
			class: "bg-blue text-white",
		},
		roleChip: {
			label: getUserRoleLabel(role),
			icon: role === "admin" ? "pi pi-shield" : "pi pi-user",
			class: role === "admin" ? "bg-red text-white" : "bg-gray text-white",
		},
	};
}

export function mapUserInvitesToRows(invites: UserInvite[]): FirebaseUserRow[] {
	return invites.map(mapUserInviteToRow);
}

function getStatusLabel(status?: string, emailVerified?: boolean): string {
	if (!status) {
		return "Inconnu";
	}

	if (status === "activated") {
		return emailVerified ? "Activé" : "E-mail non vérifié";
	} else if (status === "invited") {
		return "Invité";
	} else {
		return "Inconnu";
	}
}
