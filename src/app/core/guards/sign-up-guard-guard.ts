import { CanActivateFn } from "@angular/router";
import { Auth, isSignInWithEmailLink } from "@angular/fire/auth";
import { inject } from "@angular/core";
import { environment } from "../../../environments/environment";

export const signUpGuardGuard: CanActivateFn = (route, state) => {
	const auth = inject(Auth);
	return isSignInWithEmailLink(auth, environment.urlSignUp);
};
