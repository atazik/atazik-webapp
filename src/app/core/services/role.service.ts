import { inject, Injectable, signal } from "@angular/core";
import { Auth } from "@angular/fire/auth";
import { UserRoleEnum } from "@shared/enums/user-roles.enum";

@Injectable({
	providedIn: "root",
})
export class RoleService {
	private auth = inject(Auth);

	private _role = signal<UserRoleEnum | undefined>(undefined);
	role = this._role.asReadonly();

	constructor() {
		this.auth.onAuthStateChanged(async (auth) => {
			if (!auth) {
				this._role.set(undefined);
				return;
			}

			try {
				const idTokenResult = await auth.getIdTokenResult(true);
				const role = idTokenResult.claims["role"] as UserRoleEnum | undefined;
				this._role.set(role);
			} catch (e) {
				console.error("Error fetching user role:", e);
				this._role.set(undefined);
			}
		});
	}
}
