import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import { afterNextRender, Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactService } from '../../feature/contact/contact.service';

interface ContactFormValue {
	name: string;
	phone: string;
	email: string;
	country: string;
	message: string;
}

type ContactSubmitStatus = 'idle' | 'sending' | 'success' | 'error';

@Component({
	imports: [NgOptimizedImage, FormsModule],
	templateUrl: './landing.component.html',
	styleUrl: './landing.component.scss',
})
export class LandingComponent {
	readonly heroEntranceReady = signal(false);
	readonly contact: ContactFormValue = { name: '', phone: '', email: '', country: 'UA', message: '' };
	readonly contactSubmitStatus = signal<ContactSubmitStatus>('idle');
	private readonly document = inject(DOCUMENT);
	private readonly contactService = inject(ContactService);

	async onContactSubmit(form: NgForm): Promise<void> {
		if (form.invalid || this.contactSubmitStatus() === 'sending') return;

		this.contactSubmitStatus.set('sending');
		const { name, phone, email, country, message } = this.contact;
		const text = [
			name ? `Ім'я: ${name}` : null,
			`Телефон: ${phone}`,
			email ? `E-mail: ${email}` : null,
			country ? `Країна: ${country}` : null,
			message ? `Запитання: ${message}` : null,
		]
			.filter(Boolean)
			.join('\n');

		const sent = await this.contactService.send(text);
		if (sent) {
			this.contactSubmitStatus.set('success');
			form.resetForm({ country: 'UA' });
		} else {
			this.contactSubmitStatus.set('error');
		}
	}

	constructor() {
		afterNextRender(() => {
			this.heroEntranceReady.set(true);
			// deferred: afterNextRender can fire mid-hydration, before Angular finishes
			// claiming the SSR'd content, which would leave the observer watching
			// nodes that get swapped out
			setTimeout(() => this.observeReveals());
			setTimeout(() => this.setupParallax());
		});
	}

	private setupParallax(): void {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		if (this.document.querySelectorAll('.product-row__image img').length === 0) return;

		const range = 22; // px of travel, kept subtle
		let ticking = false;
		// re-queried on every frame rather than captured once: NgOptimizedImage
		// can replace the underlying <img> node after the initial paint, which
		// would otherwise leave this tracking a detached element forever
		const update = () => {
			const vh = window.innerHeight;
			this.document.querySelectorAll<HTMLElement>('.product-row__image img').forEach((img) => {
				const rect = img.getBoundingClientRect();
				const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
				img.style.transform = `translateY(${(progress * range).toFixed(1)}px)`;
			});
			ticking = false;
		};
		const onScroll = () => {
			if (!ticking) {
				ticking = true;
				requestAnimationFrame(update);
			}
		};

		update();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
	}

	private observeReveals(): void {
		const targets = this.document.querySelectorAll<HTMLElement>('.product-row, .reveal');
		const viewportHeight = window.innerHeight;

		// elements already on screen at load get no animation, only ones
		// below the fold are opted into the pre-enter (hidden) state; if
		// the observer ever fails to fire, everything else stays visible
		// by default instead of permanently hidden
		const offscreen: HTMLElement[] = [];
		targets.forEach((el) => {
			if (el.getBoundingClientRect().top > viewportHeight) {
				el.classList.add('pre-enter');
				offscreen.push(el);
			}
		});
		if (offscreen.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						entry.target.classList.remove('pre-enter');
						observer.unobserve(entry.target);
					}
				}
			},
			{ threshold: 0.2, rootMargin: '0px 0px -10% 0px' },
		);
		offscreen.forEach((el) => observer.observe(el));

		// safety net: never leave an element permanently hidden
		setTimeout(() => {
			offscreen.forEach((el) => el.classList.remove('pre-enter'));
			observer.disconnect();
		}, 4000);
	}
}
