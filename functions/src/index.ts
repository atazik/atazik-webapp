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
import { getAuth, UserRecord } from 'firebase-admin/auth';

admin.initializeApp();

functions.setGlobalOptions({ maxInstances: 5, region: 'europe-west9' });

/**
 * Recursively lists all users in Firebase Authentication.
 * This function handles pagination by checking for a nextPageToken.
 * It retrieves up to 1000 users at a time and continues to fetch more users
 * until there are no more users to fetch.
 * @param nextPageToken
 */
async function listAllUsers(nextPageToken?: string) {
	const result = await getAuth().listUsers(1000, nextPageToken);
	const users = result.users;
	if (result.pageToken) {
		const more: UserRecord[] = await listAllUsers(result.pageToken);
		return users.concat(more);
	}
	return users;
}

/**
 * Cloud Function to get all users from Firebase Authentication.
 * This function is callable via HTTPS and returns a list of user records.
 * Each user record includes basic information such as uid, email, displayName, etc.
 */
export const getAllUsers = functions.https.onCall(async (data, context) => {
	const userRecords = await listAllUsers();
	return userRecords.map((u) => {
		return {
			uid: u.uid,
			email: u.email,
			displayName: u.displayName,
			photoURL: u.photoURL,
			phoneNumber: u.phoneNumber,
			emailVerified: u.emailVerified,
			customClaims: u.customClaims || {},
		};
	});
});
