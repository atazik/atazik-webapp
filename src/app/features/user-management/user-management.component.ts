import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { FormsModule } from "@angular/forms";
import { AuthModule } from "@angular/fire/auth";
import { PartialFirebaseUser } from "../../core/models/firebase-user.model";
import { Card } from "primeng/card";
import { Toolbar } from "primeng/toolbar";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { UserService } from "../../core/services/user.service";
import { Ripple } from "primeng/ripple";
import { mapFirebaseUsersToRows, mapUserInvitesToRows } from "../../core/mappers/user-to-row.mapper";
import { FirebaseUserRow } from "../../core/models/tables-row/firebase-user-row.model";
import { Chip } from "primeng/chip";
import { UserInvite } from "../../core/models/user-invite.model";

@Component({
	selector: "app-user-management",
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
		Chip,
	],
	templateUrl: "./user-management.component.html",
	styleUrl: "./user-management.component.scss",
})
export class UserManagementComponent implements OnInit {
	private userService = inject(UserService);

	private usersFirebase: PartialFirebaseUser[] = [];
	private usersInvites: UserInvite[] = [];
	protected userRows: FirebaseUserRow[] = [];
	protected loading = false;

	ngOnInit(): void {
		this.fetchUsers();
	}

	/**
	 * Fetches users from the user service and maps them to rows for display.
	 */
	async fetchUsers() {
		this.loading = true;

		await this.userService
			.fetchUsers()
			.then((users) => {
				this.usersFirebase = users;
			})
			.catch((error) => {
				console.error("Error fetching users:", error);
				alert("Failed to fetch users. Please try again later.");
			});

		// Get invites
		await this.userService
			.fetchInvites()
			.then((invites) => {
				this.usersInvites = invites;
			})
			.catch((error) => {
				console.error("Error fetching invites:", error);
				alert("Failed to fetch invites. Please try again later.");
			});

		this.userRows = mapFirebaseUsersToRows(this.usersFirebase);
		this.userRows.push(...mapUserInvitesToRows(this.usersInvites));
		this.loading = false;
	}
}
