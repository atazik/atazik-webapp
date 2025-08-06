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
import { UserService } from '../../core/services/user.service';

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
	private userService = inject(UserService);

	users: FirebaseUser[] = [];
	newEmail = '';
	newPassword = '';
	loading = false;

	ngOnInit(): void {
		this.fetchUsers();
	}

	async fetchUsers() {
		this.loading = true;
		this.userService
			.fetchAllUsers()
			.then((users) => {
				console.log('Fetched', users.length, 'users:', users);
			})
			.catch((err) => console.error('Error fetching users', err));

		this.loading = false;
	}

	async createUser() {
		try {
			const userCred = await createUserWithEmailAndPassword(this.auth, this.newEmail, this.newPassword);
			alert(`User ${userCred.user.email} created!`);
			await this.fetchUsers();
		} catch (err: any) {
			alert(err.message);
		}
	}
}
