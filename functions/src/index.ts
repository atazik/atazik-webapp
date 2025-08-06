/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { auth } from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import UserRecord = auth.UserRecord;

admin.initializeApp();

functions.setGlobalOptions({ maxInstances: 5, region: 'europe-west9' });

async function listAllUsers(nextPageToken?: string) {
	const result = await getAuth().listUsers(1000, nextPageToken);
	const users = result.users;
	if (result.pageToken) {
		const more: UserRecord[] = await listAllUsers(result.pageToken);
		return users.concat(more);
	}
	return users;
}

export const getAllUsers = functions.https.onCall(async (data, context) => {
	// Optional: check context.auth.uid and add permission logic
	const userRecords = await listAllUsers();
	// Convert to plain JSON
	return userRecords.map((u) => u.toJSON());
});
