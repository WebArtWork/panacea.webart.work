import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../feature/firebase/auth.service';

@Component({
	imports: [RouterLink],
	templateUrl: './sign.component.html',
})
export class SignComponent implements OnInit {
	private readonly _auth = inject(AuthService);
	private readonly _router = inject(Router);

	protected readonly loading = signal(false);
	protected readonly error = signal('');

	async ngOnInit() {
		const user = await this._auth.ready();

		if (user) {
			void this._router.navigate(['/admin']);
		}
	}

	protected async submit(event: SubmitEvent) {
		event.preventDefault();

		const form = event.target as HTMLFormElement;
		const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
		const password = (form.elements.namedItem('password') as HTMLInputElement).value;

		this.loading.set(true);
		this.error.set('');

		try {
			await this._auth.signIn(email, password);
			void this._router.navigate(['/admin']);
		} catch {
			this.error.set('Невірний email або пароль.');
		} finally {
			this.loading.set(false);
		}
	}
}
