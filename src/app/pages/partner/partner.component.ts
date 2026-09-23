import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
	imports: [RouterLink],
	templateUrl: './partner.component.html',
})
export class PartnerComponent {
	protected readonly submitted = signal(false);

	protected submit(event: SubmitEvent) {
		event.preventDefault();
		this.submitted.set(true);
		(event.target as HTMLFormElement).reset();
	}
}
