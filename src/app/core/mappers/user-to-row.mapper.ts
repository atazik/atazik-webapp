import { PartialFirebaseUser } from "../models/firebase-user.model";
import { FirebaseUserRow } from "../models/tables-row/firebase-user-row.model";
import { UserInvite } from "../models/user-invite.model";

export function mapFirebaseUserToRow(user: PartialFirebaseUser): FirebaseUserRow {
	const { email, displayName, emailVerified, customClaims } = user;
	const statusActivated = emailVerified && customClaims?.["status"] === "activated";

	return {
		displayName: displayName || "Aucun nom défini",
		email: email || "Aucun e-mail défini",
		statusChip: {
			label: getStatusLabel(customClaims?.["status"], emailVerified),
			icon: statusActivated ? "pi pi-check" : "pi pi-times",
			class: statusActivated
				? "bg-green-500 text-white"
				: !emailVerified
					? "bg-yellow-500 text-white"
					: "bg-gray-500 text-white",
		},
		roleChip: {
			label: getRoleLabel(customClaims?.["role"]),
			icon: customClaims?.["role"] === "admin" ? "pi pi-shield" : "pi pi-user",
			class: customClaims?.["role"] === "admin" ? "bg-red-500 text-white" : "bg-gray-500 text-white",
		},
	};
}

export function mapFirebaseUsersToRows(user: PartialFirebaseUser[]): FirebaseUserRow[] {
	return user.map(mapFirebaseUserToRow);
}

export function mapUserInviteToRow(invite: UserInvite): FirebaseUserRow {
	const { email, intendedRole } = invite;
	return {
		displayName: "Invitation en attente",
		email: email || "Aucun e-mail défini",
		statusChip: {
			label: "Invité",
			icon: "pi pi-clock",
			class: "bg-blue-500 text-white",
		},
		roleChip: {
			label: getRoleLabel(intendedRole),
			icon: intendedRole === "admin" ? "pi pi-shield" : "pi pi-user",
			class: intendedRole === "admin" ? "bg-red-500 text-white" : "bg-gray-500 text-white",
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

function getRoleLabel(role?: string): string {
	if (!role) {
		return "Inconnu";
	}

	switch (role) {
		case "admin":
			return "Administrateur";
		case "user":
			return "Utilisateur";
		default:
			return "Inconnu";
	}
}
