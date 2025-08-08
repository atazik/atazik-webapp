import { PartialFirebaseUser } from '../models/firebase-user.model';
import { FirebaseUserRow } from '../models/tables-row/firebase-user-row.model';

export function mapFirebaseUserToRow(user: PartialFirebaseUser): FirebaseUserRow {
	const { uid, email, emailVerified = false, displayName } = user;

	let firstName: string | undefined;
	let lastName: string | undefined;

	if (displayName) {
		const nameParts = displayName.trim().split(' ');
		firstName = nameParts[0];
		if (nameParts.length > 1) {
			lastName = nameParts.slice(1).join(' ');
		}
	}

	return {
		uid: uid ?? '',
		email,
		emailVerified,
		firstName,
		lastName,
	};
}

export function mapFirebaseUsersToRows(user: PartialFirebaseUser[]): FirebaseUserRow[] {
	return user.map(mapFirebaseUserToRow);
}
