import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface CertificateItem {
	title: string;
}

const CERTIFICATE_ITEMS: CertificateItem[] = [
	{ title: 'Висновок державної санітарно-епідеміологічної експертизи' },
	{ title: 'Протокол лабораторних випробувань — PANACEA Arden' },
	{ title: 'Протокол лабораторних випробувань — PANACEA Diamond' },
	{ title: 'Декларація відповідності виробника' },
];

@Component({
	imports: [RouterLink],
	templateUrl: './certificates.component.html',
})
export class CertificatesComponent {
	protected readonly items = CERTIFICATE_ITEMS;
}
