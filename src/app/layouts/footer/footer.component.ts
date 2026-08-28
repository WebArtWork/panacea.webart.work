import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-footer',
	imports: [NgOptimizedImage, RouterLink],
	templateUrl: './footer.component.html',
	styles: `.footer-title { font-size: .7rem; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; } a { transition: opacity .2s ease; } a:hover { opacity: .65; } @media (min-width: 768px) { .footer-title { font-size: .82rem; } }`,
})
export class FooterComponent { protected readonly currentYear = new Date().getFullYear(); }
