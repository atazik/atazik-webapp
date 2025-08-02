import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, UserCredential } from '@angular/fire/auth';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private auth: Auth = inject(Auth);

	public signIn(email: string, password: string): Promise<UserCredential> {
		return signInWithEmailAndPassword(this.auth, email, password);
	}
}
