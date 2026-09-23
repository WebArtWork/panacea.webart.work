import { DOCUMENT } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { buildCanonicalUrl, CanonicalService } from '@wawjs/ngx-default';
import { LanguageService } from '@wawjs/ngx-translate';
import { filter } from 'rxjs';
import { environment } from '../environments/environment';
import { companyProfile } from './feature/company/company.data';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet],
	template: `<router-outlet />`,
})
export class App {
	private readonly _canonicalService = inject(CanonicalService);
	private readonly _document = inject(DOCUMENT);
	private readonly _languageService = inject(LanguageService);
	private readonly _meta = inject(Meta);

	constructor() {
		this._canonicalService.initialize();

		// Keep og:url in step with the canonical URL.
		inject(Router)
			.events.pipe(filter((event) => event instanceof NavigationEnd))
			.subscribe((event) =>
				this._meta.updateTag({
					property: 'og:url',
					content: buildCanonicalUrl(companyProfile.siteUrl, event.urlAfterRedirects),
				}),
			);

		effect(() => {
			const language = this._languageService.language();
			const htmlLang =
				environment.languages.find((item) => item.code === language)?.htmlLang ?? language;

			if (htmlLang) {
				this._document.documentElement.lang = htmlLang;
			}
		});
	}
}
