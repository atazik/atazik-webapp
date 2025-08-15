import { UserStatusEnum } from "../enums/user-status.enum";

export function getStatusLabel(status?: string, emailVerified?: boolean): string {
	if (!status) {
		return "Inconnu";
	}

	if (status === UserStatusEnum.ACTIVATED) {
		return emailVerified ? "Activé" : "E-mail non vérifié";
	} else if (status === UserStatusEnum.INVITED) {
		return "Invité";
	} else {
		return "Inconnu";
	}
}
