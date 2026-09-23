import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { MetaService } from '@wawjs/ngx-core';
import { CartService, isValidQuantity } from '../../feature/cart/cart.service';
import { companyProfile } from '../../feature/company/company.data';
import { findProduct, formatMoney, productImageAlt, productType } from '../../feature/product/product.data';
import { ToastService } from '../../feature/toast/toast.service';
import { MoneyPipe } from '../../pipes/money.pipe';

@Component({
	imports: [MoneyPipe, RouterLink],
	templateUrl: './product.component.html',
})
export class ProductComponent {
	private readonly _cartService = inject(CartService);
	private readonly _toastService = inject(ToastService);
	private readonly _metaService = inject(MetaService);
	private readonly _meta = inject(Meta);

	readonly id = input<string>();

	protected readonly product = computed(() => findProduct(this.id()));
	protected readonly productType = productType;
	protected readonly productImageAlt = productImageAlt;
	protected readonly quantity = signal(1);

	constructor() {
		// Route data only covers the generic /product path; each product needs its own SEO tags.
		effect(() => {
			const product = this.product();

			if (!product) {
				return;
			}

			const availability =
				product.stock > 0 ? 'В наявності, замовляйте від однієї пляшки.' : 'Тимчасово немає в наявності.';

			this._metaService.applyMeta({
				title: `PANACEA ${product.brand}, ${product.gas}, ${product.material.toLowerCase()} 0,5 л`,
				description: `PANACEA ${product.brand}: ${product.gas.toLowerCase()}, ${product.material.toLowerCase()}, 0,5 л. Ціна ${formatMoney(product.price)}. ${availability}`,
				image: `${companyProfile.siteUrl}/products/${product.image}`,
			});
			this._meta.updateTag({ property: 'og:type', content: 'product' });
		});
	}

	ngOnDestroy() {
		// applyMeta() doesn't manage og:type, so restore the site-wide default when leaving the page.
		this._meta.updateTag({ property: 'og:type', content: 'website' });
	}

	protected step(delta: number) {
		const next = this.quantity() + delta;

		if (isValidQuantity(next)) {
			this.quantity.set(next);
		}
	}

	protected setQuantity(input: HTMLInputElement) {
		const value = Number(input.value);

		if (isValidQuantity(value)) {
			this.quantity.set(value);
		}

		input.value = String(this.quantity());
	}

	protected addToCart() {
		const product = this.product();

		if (!product) {
			return;
		}

		this._cartService.add(product.id, this.quantity());
		this._toastService.show(`Додано до кошика: ${this.quantity()} шт.`);
	}
}
