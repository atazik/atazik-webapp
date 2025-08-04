import { Routes } from '@angular/router';
import { SignInComponent } from './features/sign-in/sign-in.component';
import { HomeComponent } from './features/home/home.component';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);

export const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		canActivate: [AuthGuard],
		data: { authGuardPipe: redirectUnauthorizedToLogin },
		title: 'Atazik - Accueil',
	},
	{ path: 'login', component: SignInComponent, title: 'Atazik - Page de connexion' },
	{ path: '**', redirectTo: 'login' },
];
