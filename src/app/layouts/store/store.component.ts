import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { CartService } from '../../feature/cart/cart.service';
import { CatalogService } from '../../feature/catalog/catalog.service';
import { companyEmailHref, companyPhoneHref, companyProfile } from '../../feature/company/company.data';
import { ToastService } from '../../feature/toast/toast.service';

@Component({
	selector: 'app-store',
	imports: [RouterLink, RouterOutlet],
	templateUrl: './store.component.html',
	styles: ':host { display: block; }',
})
export class StoreComponent {
	private readonly _router = inject(Router);
	private readonly _document = inject(DOCUMENT);

	protected readonly cartCount = inject(CartService).count;
	protected readonly catalog = inject(CatalogService);
	protected readonly toast = inject(ToastService);
	protected readonly company = companyProfile;
	protected readonly phoneHref = companyPhoneHref;
	protected readonly emailHref = companyEmailHref;

	/** The catalog search lives in the header, but only on the home page. */
	protected readonly isHome = toSignal(
		this._router.events.pipe(
			filter((event) => event instanceof NavigationEnd),
			map((event) => _isHomeUrl(event.urlAfterRedirects)),
		),
		{ initialValue: _isHomeUrl(this._router.url) },
	);

	protected search(event: SubmitEvent) {
		event.preventDefault();
		this._document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' });
	}
}

function _isHomeUrl(url: string): boolean {
	return (url.split(/[?#]/)[0] || '/') === '/';
}
