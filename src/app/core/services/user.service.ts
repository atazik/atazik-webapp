import { inject, Injectable } from "@angular/core";
import { Functions, FunctionsModule, httpsCallable } from "@angular/fire/functions";
import { PartialFirebaseUser } from "../models/firebase-user.model";
import { collection, doc, Firestore, FirestoreModule, getDoc, getDocs } from "@angular/fire/firestore";
import { SecureStorageService } from "./secure-storage.service";
import { UserInvite } from "../models/user-invite.model";

@Injectable({ providedIn: "root", deps: [FunctionsModule, FirestoreModule] })
export class UserService {
	private functions = inject(Functions);
	private firestore = inject(Firestore);
	private secureStorageService = inject(SecureStorageService);

	/**
	 * Fetches invites from Firebase Firestore.
	 */
	async fetchInvites(): Promise<UserInvite[]> {
		const getInvites = collection(this.firestore, "pendingInvites");
		const querySnapshot = await getDocs(getInvites);
		const invites: UserInvite[] = [];
		querySnapshot.forEach((doc) => {
			invites.push(doc.data() as UserInvite);
		});
		return invites;
	}

	/**
	 * Fetches users from Firebase or local storage based on the version index.
	 * If the version in local storage is less than the version in Firebase, it fetches from Firebase.
	 * Otherwise, it retrieves users from local storage.
	 */
	async fetchUsers(): Promise<PartialFirebaseUser[]> {
		const firestoreUserAuthVersionStorage = this.firestoreUserAuthVersionFromStorage;
		const firestoreUserAuthVersionFirebase = await this.firestoreUserAuthVersionIndex;

		if (firestoreUserAuthVersionStorage === firestoreUserAuthVersionFirebase) {
			const usersStorage = await this.usersStorage;
			if (usersStorage) {
				return usersStorage;
			}
		}
		const usersFirebase = await this.fetchUsersFromFirebase();
		this.usersStorage = usersFirebase;
		this.firestoreUserAuthVersionToStorage = firestoreUserAuthVersionFirebase;
		return usersFirebase;
	}

	/**
	 * Fetches users from Firebase using a callable function.
	 * This function retrieves all users and maps them to PartialFirebaseUser objects.
	 */
	private async fetchUsersFromFirebase(): Promise<PartialFirebaseUser[]> {
		let result: PartialFirebaseUser[] = [];
		const getAllUsers = httpsCallable(this.functions, "getAllUsers");
		await getAllUsers()
			.then((response) => {
				if (response.data && Array.isArray(response.data)) {
					result = response.data.map((user) => {
						return user as PartialFirebaseUser;
					});
				}
			})
			.catch((error) => {
				console.error("Error fetching users:", error);
				throw new Error("Failed to fetch users");
			});

		return result;
	}

	/**
	 * Retrieves the user authentication version index from Firestore.
	 */
	private get firestoreUserAuthVersionIndex(): Promise<number> {
		const docRef = doc(this.firestore, "admin", "global");
		return getDoc(docRef).then((doc): number => {
			if (doc.exists()) {
				return doc.data()["userAuthVersion"] || 0;
			}
			return 0;
		});
	}

	/**
	 * Retrieves the user authentication version from local storage.
	 * @return The version number from local storage or 0 if not found.
	 */
	private get firestoreUserAuthVersionFromStorage(): number {
		const version = localStorage.getItem("userAuthVersion");
		return version ? parseInt(version, 10) : 0;
	}

	/**
	 * Sets the user authentication version in local storage.
	 * @param version The version number to set.
	 */
	private set firestoreUserAuthVersionToStorage(version: number) {
		localStorage.setItem("userAuthVersion", version.toString());
	}

	/**
	 * Stores the fetched users in secure storage.
	 * This method is used to cache users locally for faster access.
	 * @param users The array of PartialFirebaseUser objects to store.
	 */
	private set usersStorage(users: PartialFirebaseUser[]) {
		this.secureStorageService.setItem("firebaseUsers", users, 999999999);
	}

	/**
	 * Retrieves the stored users from secure storage.
	 * This method is used to access cached users.
	 * @returns A promise that resolves to an array of PartialFirebaseUser objects.
	 */
	private get usersStorage(): Promise<PartialFirebaseUser[] | null> {
		return this.secureStorageService.getItem("firebaseUsers");
	}
}
