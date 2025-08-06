import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Auth, AuthModule, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { FirebaseUser } from '../../shared/models/firebase-user.model';
import { Card } from 'primeng/card';
import { Toolbar } from 'primeng/toolbar';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';

@Component({
	selector: 'app-user-management',
	imports: [
		CommonModule,
		TableModule,
		ButtonModule,
		InputTextModule,
		FormsModule,
		AuthModule,
		Card,
		Toolbar,
		IconField,
		InputIcon,
	],
	templateUrl: './user-management.component.html',
	styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
	private auth = inject(Auth);

	users: FirebaseUser[] = [];
	newEmail = '';
	newPassword = '';
	loading = false;

	ngOnInit(): void {
		this.fetchUsers();
	}

	async fetchUsers() {
		this.loading = true;
		// Firebase client SDK cannot list users directly.
		// This would require a Cloud Function or Firebase Admin SDK on server.
		// For demo, we'll just add currently logged-in user
		if (this.auth.currentUser) {
			this.users = [{ uid: this.auth.currentUser.uid, email: this.auth.currentUser.email }];
		}

		this.loading = false;
	}

	async createUser() {
		try {
			const userCred = await createUserWithEmailAndPassword(this.auth, this.newEmail, this.newPassword);
			alert(`User ${userCred.user.email} created!`);
			this.fetchUsers();
		} catch (err: any) {
			alert(err.message);
		}
	}
}
