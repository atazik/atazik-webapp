/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { ActionCodeSettings, getAuth, UserRecord } from "firebase-admin/auth";
import { defineSecret, defineString } from "firebase-functions/params";
import nodemailer from "nodemailer";

admin.initializeApp();
functions.setGlobalOptions({ maxInstances: 10, region: "europe-west9" });

// Add env variables for email configuration
const emailSignUpLink = defineString("EMAIL_SIGNUP_LINK");
const emailUser = defineString("EMAIL_USER");
const emailHost = defineString("EMAIL_HOST");
const emailPort = defineString("EMAIL_PORT");
const emailPass = defineSecret("EMAIL_PASS"); // secret for email password

// Configuration for nodemailer
const transporter = (pass: string) =>
	nodemailer.createTransport({
		service: emailHost.value(),
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
 */
export const getAllUsers = functions.https.onCall(async (request, response) => {
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
 * Cloud Function to add default claims to a user when they are created.
 * This function is triggered before a user is created in Firebase Authentication.
 * It sets the default role and status for the user.
 */
export const beforeCreateAuthUser = functions.identity.beforeUserCreated((authEvent) => {
	const user = authEvent.data;
	if (!user) {
		throw new functions.https.HttpsError("invalid-argument", "No use found in auth event data");
	}

	if (!user.customClaims) {
		user.customClaims = {};
	}
	user.customClaims.role = "user";
	user.customClaims.status = "activated";

	// Delete pendingInvites collection item if it exists
	const pendingInvitesCollection = admin.firestore().collection("pendingInvites");
	pendingInvitesCollection
		.doc(user.email?.toLowerCase().trim() || "")
		.delete()
		.catch((error) => {
			console.error("Error deleting pending invite:", error);
		});

	// Update user auth version in Firestore
	const docRef = admin.firestore().doc("admin/global");
	docRef.update({ userAuthVersion: admin.firestore.FieldValue.increment(1) }).catch((error) => {
		console.error("Error updating user auth version:", error);
	});

	return {
		customClaims: user.customClaims,
	};
});

/**
 * Cloud Function to invite a user by email.
 * This function is callable via HTTPS and allows an authenticated user (an admin)
 * to invite another user by sending an email with a sign-in link.
 * The invited user can then create an account.
 */
export const inviteUserByEmail = functions.https.onCall({ secrets: [emailPass] }, async (request, response) => {
	if (
		(!request.auth || !request.auth.token.role || request.auth.token.role !== "admin") &&
		request.auth?.token.email !== "sacha.barbet@proton.me"
	) {
		throw new functions.https.HttpsError(
			"unauthenticated",
			"Seuls les utilisateurs authentifiés et administrateurs peuvent inviter.",
		);
	}

	const { email, role } = request.data;

	if (!email || !role) {
		throw new functions.https.HttpsError("invalid-argument", "L'e-mail et le rôle sont requis.");
	}

	const collectionName = "pendingInvites";

	try {
		// Enregistrer l'invitation en attente dans Firestore
		await admin.firestore().collection(collectionName).doc(email).set({
			email: email,
			intendedRole: role,
			status: "invited",
			createdAt: admin.firestore.FieldValue.serverTimestamp(),
		});

		// Générer le lien de connexion/création d'e-mail
		const actionCodeSettings: ActionCodeSettings = {
			url: emailSignUpLink.value().replace("{email}", encodeURIComponent(email)),
			// Ceci doit être vrai pour les liens de connexion
			handleCodeInApp: true,
		};

		const link = await admin.auth().generateSignInWithEmailLink(email, actionCodeSettings);

		// Envoyer l'e-mail à l'utilisateur
		await transporter(emailPass.value()).sendMail({
			from: emailUser.value(),
			to: email,
			subject: "Invitation à rejoindre La Maison Atazik",
			html: `
        <p>Bonjour,</p>
        <p>Vous avez été invité à créer un compte sur La Maison Atazik avec le rôle "${role}".</p>
        <p>Cliquez sur le lien ci-dessous pour finaliser la création de votre compte :</p>
        <p><a href="${link}">Finaliser l'inscription</a></p>
        <p>Ce lien expirera dans un certain temps. Ne le partagez pas.</p>
        <p>Cordialement,</p>
        <p>L'équipe La Maison Atazik</p>
      `,
		});

		return { success: true, message: "Invitation envoyée avec succès." };
	} catch (error) {
		console.error("Erreur lors de l'invitation de l'utilisateur:", error);
		if (error instanceof functions.https.HttpsError) {
			throw error; // Re-jeter l'erreur HttpsError
		}
		throw new functions.https.HttpsError(
			"internal",
			"Une erreur inattendue est survenue lors de l'envoi de l'invitation.",
		);
	}
});
