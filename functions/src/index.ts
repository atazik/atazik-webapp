import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { ActionCodeSettings, getAuth, UserRecord } from "firebase-admin/auth";
import { defineSecret, defineString } from "firebase-functions/params";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { UserStatusEnum } from "@shared/enums/user-status.enum";
import { FirestoreCollectionsEnum } from "@shared/enums/firebase/firestore-collections.enum";
import { isUserRoleEqualOrHigher } from "@shared/utils/user-role.utils";
import { UserRoleEnum } from "@shared/enums/user-roles.enum";

admin.initializeApp();
functions.setGlobalOptions({ maxInstances: 10, region: "europe-west9" });

// Add env variables for email configuration
const emailSignUpLink = defineString("EMAIL_SIGNUP_LINK");
const emailUser = defineString("EMAIL_USER");
const emailHost = defineString("EMAIL_HOST");
const emailPort = defineString("EMAIL_PORT");
const emailPass = defineSecret("EMAIL_PASS");
const appName = defineString("APP_NAME");
const ownerEmail = defineString("OWNER_EMAIL");

// Configuration for nodemailer
const transporter = (pass: string) =>
	nodemailer.createTransport({
		host: emailHost.value(),
		port: Number.parseInt(emailPort.value()),
		secure: true,
		auth: {
			user: emailUser.value(),
			pass: pass,
		},
	});

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
 * Minimum role required to call this function is PRESIDENT.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getAllUsers = functions.https.onCall(async (request, response) => {
	if (!isAuthorized(request, UserRoleEnum.PRESIDENT)) {
		throw new functions.https.HttpsError(
			"unauthenticated",
			"Seuls les utilisateurs authentifiés et administrateurs peuvent accéder à cette fonction.",
		);
	}

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

/**
 * Cloud Function to add default claims to a user when they are created and block if needed.
 * This function is triggered before a user is created in Firebase Authentication.
 * It sets the role and status for the user.
 * Get the pending invite for the user and delete it.
 * It also updates the user auth version in Firestore.
 */
export const beforeCreateAuthUser = functions.identity.beforeUserCreated(async (authEvent) => {
	const user = authEvent.data;
	if (!user) {
		throw new functions.https.HttpsError("invalid-argument", "No use found in auth event data");
	}

	const email = user.email?.toLowerCase().trim();
	if (!email) {
		throw new functions.https.HttpsError("invalid-argument", "L'e-mail de l'utilisateur est requis.");
	}

	const pendingInvitesCollection = admin.firestore().collection(FirestoreCollectionsEnum.PENDING_INVITES);
	const pendingInviteDoc = await pendingInvitesCollection.where("email", "==", email).limit(1).get();

	if (pendingInviteDoc.empty) {
		// If no pending invite, block the user creation
		throw new functions.https.HttpsError("failed-precondition", "Aucun utilisateur en attente d'invitation trouvé.");
	}

	// Delete the pending invite if it exists
	const pendingInviteId = pendingInviteDoc.docs[0].id;
	await pendingInvitesCollection
		.doc(pendingInviteId)
		.delete()
		.catch((error) => {
			console.error("Error deleting pending invite:", error);
			throw new functions.https.HttpsError("internal", "Erreur lors de la suppression de l'invitation en attente.");
		});

	const docData = pendingInviteDoc.docs[0].data();
	if (docData["expiresAt"] < Date.now()) {
		throw new functions.https.HttpsError("failed-precondition", "L'invitation a expiré.");
	}

	// Set default custom claims for the user
	if (!user.customClaims) {
		user.customClaims = {};
	}
	user.customClaims.role = pendingInviteDoc.docs[0].data()!["role"];
	user.customClaims.status = UserStatusEnum.ACTIVATED;

	// Update user auth version in Firestore
	const docRef = admin.firestore().doc(`${FirestoreCollectionsEnum.ADMIN}/global`);
	docRef.update({ userAuthVersion: admin.firestore.FieldValue.increment(1) }).catch((error) => {
		console.error("Error updating user auth version:", error);
	});

	return {
		customClaims: user.customClaims,
	};
});

/**
 * Cloud Function to invite a user by email.
 * This function is callable via HTTPS and allows an authenticated user (an admin or president)
 * to invite another user by sending an email with a sign-in link.
 * The invited user can then create an account.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const inviteUserByEmail = functions.https.onCall({ secrets: [emailPass] }, async (request, response) => {
	if (!isAuthorized(request, UserRoleEnum.PRESIDENT)) {
		throw new functions.https.HttpsError(
			"unauthenticated",
			"Seuls les utilisateurs authentifiés et administrateurs peuvent inviter.",
		);
	}

	let { email, role } = request.data;

	if (!email || !role) {
		throw new functions.https.HttpsError("invalid-argument", "L'e-mail et le rôle sont requis.");
	}
	email = email.toLowerCase().trim();
	role = role.toLowerCase().trim();

	const token = uuidv4();

	try {
		// Save the pending invite in Firestore
		await admin
			.firestore()
			.collection(FirestoreCollectionsEnum.PENDING_INVITES)
			.doc(token)
			.set({
				email: email,
				role: role,
				status: UserStatusEnum.INVITED,
				createdAt: admin.firestore.FieldValue.serverTimestamp(),
				expiresAt: Date.now() + 24 * 60 * 60 * 1000, // expire dans 1 jour
			});

		// Générer le lien de connexion/création d'e-mail
		const actionCodeSettings: ActionCodeSettings = {
			url: emailSignUpLink.value() + `?token=${token}`,
			handleCodeInApp: true,
		};

		const link = await admin.auth().generateSignInWithEmailLink(email, actionCodeSettings);

		// Envoyer l'e-mail à l'utilisateur
		await transporter(emailPass.value()).sendMail({
			from: emailUser.value(),
			to: email,
			subject: `Invitation à rejoindre ${appName.value()}`,
			html: `
        <p>Bonjour,</p>
        <p>Vous avez été invité à créer un compte sur ${appName.value()} avec le rôle "${role}".</p>
        <p>Cliquez sur le lien ci-dessous pour finaliser la création de votre compte :</p>
        <p><a href="${link}">Finaliser l'inscription</a></p>
        <p>Ce lien expirera dans un certain temps. Ne le partagez pas.</p>
        <p>Cordialement,</p>
        <p>L'équipe ${appName.value()}</p>
      `,
		});

		return { success: true, message: "Invitation envoyée avec succès." };
	} catch (error) {
		if (error instanceof functions.https.HttpsError) {
			throw error; // Re-jeter l'erreur HttpsError
		}

		throw new functions.https.HttpsError(
			"internal",
			"Une erreur inattendue est survenue lors de l'envoi de l'invitation.",
		);
	}
});

function isAuthorized(request: functions.https.CallableRequest, roleRequired: UserRoleEnum): boolean {
	return (
		(request.auth && request.auth.token && isUserRoleEqualOrHigher(request.auth.token.role, roleRequired)) ||
		request.auth?.token.email === ownerEmail.value()
	);
}
