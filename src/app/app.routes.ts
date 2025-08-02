import { Routes } from '@angular/router';
import { SignInComponent } from './features/sign-in/sign-in.component';

export const routes: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{ path: 'login', component: SignInComponent },
	{ path: '**', redirectTo: 'login' },
];
