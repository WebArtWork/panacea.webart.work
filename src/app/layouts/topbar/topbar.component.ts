import { NgOptimizedImage } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-topbar',
	imports: [NgOptimizedImage, RouterLink],
	host: { '(document:keydown.escape)': 'closeCertificates()' },
	templateUrl: './topbar.component.html',
	styleUrl: './topbar.component.scss',
})
export class TopbarComponent {
	protected readonly menuOpen = signal(false);
	protected readonly certificatesOpen = signal(false);
	protected toggleMenu() { this.menuOpen.update((open) => !open); }
	protected closeMenu() { this.menuOpen.set(false); }
	protected openCertificates(event: Event) {
		event.preventDefault();
		this.menuOpen.set(false);
		this.certificatesOpen.set(true);
	}
	protected closeCertificates() { this.certificatesOpen.set(false); }
}
