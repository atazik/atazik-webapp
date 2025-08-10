import { Component, inject, OnInit } from "@angular/core";
import {
	Auth,
	AuthModule,
	isSignInWithEmailLink,
	signInWithEmailLink,
	updatePassword,
	updateProfile
} from "@angular/fire/auth";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { FloatLabelModule } from "primeng/floatlabel";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { PasswordModule } from "primeng/password";
import { ButtonModule } from "primeng/button";
import { MessageModule } from "primeng/message";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Ripple } from "primeng/ripple";
import { InputText } from "primeng/inputtext";

@Component({
	selector: "app-sign-up",
	imports: [
		CardModule,
		DividerModule,
		FloatLabelModule,
		IconFieldModule,
		InputIconModule,
		PasswordModule,
		ButtonModule,
		MessageModule,
		ReactiveFormsModule,
		Ripple,
		InputText,
	],
	providers: [AuthModule],
	templateUrl: "./sign-up.component.html",
	styleUrl: "./sign-up.component.scss",
})
export class SignUpComponent implements OnInit {
	private auth = inject(Auth);
	private formBuilder = inject(FormBuilder);
	private router = inject(Router);

	protected isSignInWithEmailLink = isSignInWithEmailLink(this.auth, window.location.href);

	protected loading = false;
	protected error = "";

	protected readonly formSignUp = this.formBuilder.group({
		firstName: ["", { validators: [Validators.required] }],
		lastName: ["", { validators: [Validators.required] }],
		email: ["", { validators: [Validators.required, Validators.email] }],
		password: ["", { validators: [Validators.required] }],
		confirmPassword: ["", { validators: [Validators.required] }],
	});

	public ngOnInit(): void {
		if (!this.isSignInWithEmailLink) {
			this.router.navigate(["/"]);
			return;
		}
	}

	protected async onSubmit() {
		if (this.formSignUp.invalid) {
			this.formSignUp.markAllAsTouched();
			return;
		}
		this.error = "";

		const { firstName, lastName, email, password, confirmPassword } = this.formSignUp.value;

		if (password !== confirmPassword) {
			this.error = "Les mots de passe ne correspondent pas.";
			return;
		}

		if (!this.isSignInWithEmailLink) {
			this.error = "La connexion à expirée ou n'est pas valide.";
			return;
		}

		this.loading = true;
		try {
			await signInWithEmailLink(this.auth, email!.toLowerCase().trim(), window.location.href);
		} catch (e) {
			console.error("Error signing in with email link:", e);
			this.error = "Une erreur est survenue lors de la connexion. Veuillez réessayer.";
			this.loading = false;
			return;
		}

		try {
			await updateProfile(this.auth.currentUser!, {
				displayName: `${firstName} ${lastName}`,
			});
			await updatePassword(this.auth.currentUser!, password!);
			this.formSignUp.reset();
			this.router.navigate(["/"]);
		} catch (error) {
			console.error("Error during sign-up:", error);
			this.error = "Une erreur est survenue. Veuillez réessayer.";
		} finally {
			this.loading = false;
		}
	}
}
