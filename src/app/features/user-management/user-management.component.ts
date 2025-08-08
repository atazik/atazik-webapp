import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Auth, AuthModule, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { FirebaseUser, PartialFirebaseUser } from '../../core/models/firebase-user.model';
import { Card } from 'primeng/card';
import { Toolbar } from 'primeng/toolbar';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { UserService } from '../../core/services/user.service';
import { Ripple } from 'primeng/ripple';
import { mapFirebaseUsersToRows } from '../../core/mappers/firebase-user-to-row.mapper';

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
		Ripple,
	],
	templateUrl: './user-management.component.html',
	styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
	private auth = inject(Auth);
	private userService = inject(UserService);

	private users: PartialFirebaseUser[] = [];
	protected userRows: FirebaseUser[] = [];
	newEmail = '';
	newPassword = '';
	loading = false;

	ngOnInit(): void {
		this.fetchUsers();
	}

	async fetchUsers() {
		this.loading = true;
		await this.userService
			.fetchAllUsers()
			.then((users) => {
				this.users = users;
			})
			.catch((error) => {
				console.error('Error fetching users:', error);
				alert('Failed to fetch users. Please try again later.');
			});
		this.userRows = mapFirebaseUsersToRows(this.users);
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
