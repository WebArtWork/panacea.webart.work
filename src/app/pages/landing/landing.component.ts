import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import { afterNextRender, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ContactFormValue {
	name: string;
	phone: string;
	email: string;
	country: string;
	message: string;
}

@Component({
	imports: [NgOptimizedImage, FormsModule],
	templateUrl: './landing.component.html',
	styleUrl: './landing.component.scss',
})
export class LandingComponent {
	readonly heroEntranceReady = signal(false);
	readonly contact: ContactFormValue = { name: '', phone: '', email: '', country: '', message: '' };
	private readonly document = inject(DOCUMENT);

	onContactSubmit(): void {
		const { name, phone, email, country, message } = this.contact;
		const body = [`Ім'я: ${name}`, `Телефон: ${phone}`, `E-mail: ${email}`, `Країна: ${country}`, `Запитання: ${message}`].join('\n');
		const mailto = `mailto:info@panacea.ua?subject=${encodeURIComponent('Зворотній зв\'язок з сайту')}&body=${encodeURIComponent(body)}`;
		this.document.defaultView?.open(mailto, '_self');
	}

	constructor() {
		afterNextRender(() => {
			this.heroEntranceReady.set(true);
			// deferred: afterNextRender can fire mid-hydration, before Angular finishes
			// claiming the SSR'd product rows, which would leave the observer watching
			// nodes that get swapped out
			setTimeout(() => this.observeProductRows());
		});
	}

	private observeProductRows(): void {
		const rows = this.document.querySelectorAll<HTMLElement>('.product-row');
		const viewportHeight = window.innerHeight;

		// rows already on screen at load get no animation, only ones below
		// the fold are opted into the pre-enter (hidden) state; if the
		// observer ever fails to fire, everything else stays visible by
		// default instead of permanently hidden
		const offscreenRows: HTMLElement[] = [];
		rows.forEach((row) => {
			if (row.getBoundingClientRect().top > viewportHeight) {
				row.classList.add('pre-enter');
				offscreenRows.push(row);
			}
		});
		if (offscreenRows.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						entry.target.classList.remove('pre-enter');
						observer.unobserve(entry.target);
					}
				}
			},
			{ threshold: 0.2 },
		);
		offscreenRows.forEach((row) => observer.observe(row));

		// safety net: never leave a row permanently hidden
		setTimeout(() => {
			offscreenRows.forEach((row) => row.classList.remove('pre-enter'));
			observer.disconnect();
		}, 4000);
	}
}
