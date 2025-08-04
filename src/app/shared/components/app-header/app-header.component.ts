import { Component, inject } from '@angular/core';
import { Auth, AuthModule } from '@angular/fire/auth';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-header',
	imports: [AuthModule, RouterModule],
	templateUrl: './app-header.component.html',
	styleUrl: './app-header.component.scss',
})
export class AppHeaderComponent {
	protected auth = inject(Auth);
}
