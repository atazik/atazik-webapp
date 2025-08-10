import { Routes } from "@angular/router";
import { SignInComponent } from "./features/sign-in/sign-in.component";
import { AuthGuard, redirectUnauthorizedTo } from "@angular/fire/auth-guard";
import { HomeComponent } from "./core/services/home/home.component";
import { UserManagementComponent } from "./features/user-management/user-management.component";
import { SignUpComponent } from "./features/sign-up/sign-up.component";

const redirectUnauthorizedToSignIn = () => redirectUnauthorizedTo(["/sign-in"]);

export const routes: Routes = [
	{
		path: "app",
		canActivate: [AuthGuard],
		data: { authGuardPipe: redirectUnauthorizedToSignIn },
		children: [
			{
				path: "",
				pathMatch: "full",
				redirectTo: "home",
			},
			{
				path: "home",
				component: HomeComponent,
				title: "Atazik - Accueil",
			},
			{
				path: "user-management",
				component: UserManagementComponent,
				title: "Atazik - Gestion des utilisateurs",
			},
		],
	},
	{ path: "sign-in", component: SignInComponent, title: "Atazik - Connexion" },
	{
		path: "finish-signup",
		component: SignUpComponent,
		title: "Atazik - Inscription",
		canActivate: [AuthGuard],
		data: { authGuardPipe: redirectUnauthorizedToSignIn },
	},
	{ path: "", redirectTo: "app/home", pathMatch: "full" },
	{ path: "**", redirectTo: "app/home" },
];
