import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Service()
export class ContactService {
	private readonly http = inject(HttpClient);

	async send(message: string): Promise<boolean> {
		try {
			const response = await firstValueFrom(
				this.http.post<true | { error: string }>(`${environment.apiUrl}/api/telegram/contact`, {
					slug: environment.companyId,
					message,
				}),
			);
			return response === true;
		} catch {
			return false;
		}
	}
}
