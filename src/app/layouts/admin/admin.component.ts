import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../feature/firebase/auth.service';

@Component({
	selector: 'app-admin',
	imports: [RouterLink, RouterLinkActive, RouterOutlet],
	templateUrl: './admin.component.html',
	styles: ':host { display: block; }',
})
export class AdminComponent {
	private readonly _auth = inject(AuthService);
	private readonly _router = inject(Router);

	protected readonly user = this._auth.user;
	/** True once the initial auth-state check has resolved (or redirected away). */
	protected readonly checked = signal(false);

	constructor() {
		void this._checkAuth();
	}

	protected async logout() {
		await this._auth.signOutUser();
		void this._router.navigate(['/admin/sign']);
	}

	private async _checkAuth() {
		const user = await this._auth.ready();

		if (!user) {
			void this._router.navigate(['/admin/sign']);
			return;
		}

		this.checked.set(true);
	}
}
