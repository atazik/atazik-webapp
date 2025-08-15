import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { InputText } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { UserService } from "../../../../core/services/user.service";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Message } from "primeng/message";
import { listUserRolesWithLabel } from "../../../../core/enums/user-roles.enum";

@Component({
	selector: "app-invite-user-dialog",
	imports: [DialogModule, ButtonModule, InputText, SelectModule, FormsModule, ReactiveFormsModule, Message],
	templateUrl: "./invite-user-dialog.component.html",
	styleUrl: "./invite-user-dialog.component.scss",
})
export class InviteUserDialogComponent {
	private userService = inject(UserService);
	private formBuilder = inject(FormBuilder);

	@Input() visible = false;
	@Output() visibleChange = new EventEmitter<boolean>();

	@Output() confirm = new EventEmitter<void>();

	protected loading = false;
	protected error = "";

	protected readonly formInviteUser = this.formBuilder.group({
		email: ["", { validators: [Validators.required, Validators.email] }],
		role: ["", { validators: [Validators.required] }],
	});

	protected readonly roles = listUserRolesWithLabel();

	async onSubmit() {
		if (this.formInviteUser.invalid) {
			this.formInviteUser.markAllAsTouched();
			return;
		}
		this.error = "";

		const email = this.formInviteUser.get("email")?.value?.toLowerCase().trim();
		const role = this.formInviteUser.get("role")?.value;

		this.loading = true;
		try {
			await this.userService.inviteUserByEmail({ email: email!, role: role! });
			this.formInviteUser.reset();
			this.confirm.emit();
			this.onClose();
		} catch (error) {
			console.error("Error inviting user:", error);
			this.error = "Une erreur est survenue. Veuillez réessayer.";
		} finally {
			this.loading = false;
		}
	}

	onClose() {
		this.visibleChange.emit(false);
	}
}
