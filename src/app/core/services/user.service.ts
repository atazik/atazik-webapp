import { inject, Injectable } from '@angular/core';
import { Functions, FunctionsModule, httpsCallable } from '@angular/fire/functions';
import { PartialFirebaseUser } from '../models/firebase-user.model';

@Injectable({ providedIn: 'root', deps: [FunctionsModule] })
export class UserService {
	private functions = inject(Functions);

	async fetchAllUsers(): Promise<PartialFirebaseUser[]> {
		let result: PartialFirebaseUser[] = [];
		const getAllUsers = httpsCallable(this.functions, 'getAllUsers');
		await getAllUsers()
			.then((response) => {
				console.log(response);
				if (response.data && Array.isArray(response.data)) {
					result = response.data.map((user) => {
						return user as PartialFirebaseUser;
					});
				}
			})
			.catch((error) => {
				console.error('Error fetching users:', error);
				throw new Error('Failed to fetch users');
			});

		console.log(result);
		return result;
	}
}
