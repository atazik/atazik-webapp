import { Component, inject } from '@angular/core';
import { Auth, AuthModule } from '@angular/fire/auth';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';

@Component({
	selector: 'app-header',
	imports: [AuthModule, RouterModule, ConfirmDialog, ToastModule, ButtonModule],
	providers: [ConfirmationService, MessageService],
	templateUrl: './app-header.component.html',
	styleUrl: './app-header.component.scss',
})
export class AppHeaderComponent {
	protected auth = inject(Auth);
	protected confirmationService = inject(ConfirmationService);
	protected messageService = inject(MessageService);
	private router = inject(Router);

	confirmSignOut() {
		this.confirmationService.confirm({
			message: 'Êtes-vous sûr de vouloir vous déconnecter ?',
			header: 'Confirmation',
			icon: 'pi pi-exclamation-triangle',
			acceptLabel: 'Me déconnecter',
			rejectLabel: 'Annuler',
			accept: () => {
				this.auth.signOut().then(async () => {
					this.messageService.add({ severity: 'info', summary: 'Déconnecté', detail: 'Vous êtes déconnecté' });
					await this.router.navigate(['/login']);
				});
			},
		});
	}
}
