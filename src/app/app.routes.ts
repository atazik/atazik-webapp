import { Routes } from "@angular/router";
import { SignInComponent } from "./features/sign-in/sign-in.component";
import { AuthGuard, redirectUnauthorizedTo } from "@angular/fire/auth-guard";
import { HomeComponent } from "./features/app/home/home.component";
import { UserManagementComponent } from "./features/app/user-management/user-management.component";
import { SignUpComponent } from "./features/sign-up/sign-up.component";
import { roleGuard } from "./core/guards/role.guard";
import { UserRoleEnum } from "@shared/enums/user-roles.enum";
import { statusGuard } from "./core/guards/status.guard";
import { UserStatusEnum } from "@shared/enums/user-status.enum";

const redirectUnauthorizedToSignIn = () => redirectUnauthorizedTo(["/sign-in"]);

export const routes: Routes = [
	{
		path: "app",
		canActivate: [AuthGuard, statusGuard],
		data: { authGuardPipe: redirectUnauthorizedToSignIn, status: UserStatusEnum.ACTIVATED },
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
				canActivate: [roleGuard],
				data: { role: UserRoleEnum.PRESIDENT },
				title: "Atazik - Gestion des utilisateurs",
			},
		],
	},
	{ path: "sign-in", component: SignInComponent, title: "Atazik - Connexion" },
	{
		path: "sign-up",
		component: SignUpComponent,
		title: "Atazik - Inscription",
	},
	{ path: "", redirectTo: "app/home", pathMatch: "full" },
	{ path: "**", redirectTo: "app/home" },
];
