import { NgOptimizedImage } from '@angular/common';
import { Component, signal } from '@angular/core';

type Product = {
	alt: string;
	src: string;
};

@Component({
	imports: [NgOptimizedImage],
	host: { '(document:keydown.escape)': 'closeProduct()' },
	templateUrl: './landing.component.html',
	styleUrl: './landing.component.scss',
})
export class LandingComponent {
	readonly products: Product[] = [
		{ src: 'products/arden-1.png', alt: 'PANACEA Arden' },
		{ src: 'products/arden-2.png', alt: 'PANACEA Arden' },
		{ src: 'products/diamond-1.png', alt: 'PANACEA Diamond' },
		{ src: 'products/diamond-2.png', alt: 'PANACEA Diamond' },
		{ src: 'products/diamond-3.png', alt: 'PANACEA Diamond' },
		{ src: 'products/diamond-4.png', alt: 'PANACEA Diamond' },
		{ src: 'products/diamond-5.png', alt: 'PANACEA Diamond' },
	];

	readonly activeProduct = signal<Product | null>(null);

	openProduct(product: Product): void {
		this.activeProduct.set(product);
	}

	closeProduct(): void {
		this.activeProduct.set(null);
	}
}
