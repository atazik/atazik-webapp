import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Password } from 'primeng/password';
import { ButtonDirective } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { FloatLabel } from 'primeng/floatlabel';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { FirebaseErrorsEnum } from '../../core/enums/firebase-errors.enum';
import { PASSWORD } from '../../core/constants/regex.constant';
import { Auth, AuthModule, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
	selector: 'app-sign-in',
	imports: [
		CommonModule,
		ReactiveFormsModule,
		Password,
		ButtonDirective,
		InputText,
		Message,
		FloatLabel,
		InputGroup,
		InputGroupAddon,
		AuthModule,
	],
	templateUrl: './sign-in.component.html',
	styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
	private fb: FormBuilder = inject(FormBuilder);
	private auth = inject(Auth);
	private router = inject(Router);

	error = '';
	loginForm = this.fb.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.pattern(PASSWORD)]],
	});

	async login() {
		this.error = '';
		const { email, password } = this.loginForm.value;
		try {
			await signInWithEmailAndPassword(this.auth, email!.trim().toLowerCase(), password!);
			await this.router.navigate(['/']);
		} catch (err: unknown) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			if (err.code === FirebaseErrorsEnum.INVALID_LOGIN_CREDENTIALS) {
				this.error = 'Identifiants invalides. Veuillez vérifier votre adresse e-mail et votre mot de passe.';
			} else {
				this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
				console.log(err);
			}
		}
	}
}
