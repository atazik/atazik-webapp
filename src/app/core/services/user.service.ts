import { Injectable } from '@angular/core';
import { getFunctions, httpsCallable } from '@angular/fire/functions';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
	private functions = getFunctions();

	async fetchAllUsers(): Promise<never[]> {
		const func = httpsCallable(this.functions, 'getAllUsers');
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		const result = await firstValueFrom(func({}));
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		return result.data; // array of user JSON objects
	}
}
