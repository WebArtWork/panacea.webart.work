import { DOCUMENT } from '@angular/common';
import { afterNextRender, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService, isValidQuantity } from '../../feature/cart/cart.service';
import { CatalogBrand, CatalogService, CatalogSort } from '../../feature/catalog/catalog.service';
import {
	PRODUCT_GASES,
	PRODUCT_MATERIALS,
	PRODUCTS,
	productImageAlt,
	productType,
} from '../../feature/product/product.data';
import { Product, ProductGas, ProductMaterial } from '../../feature/product/product.interface';
import { ToastService } from '../../feature/toast/toast.service';
import { MoneyPipe } from '../../pipes/money.pipe';

interface ModelContextTool {
	name: string;
	description: string;
	inputSchema: object;
	annotations: object;
	execute: (input: { productId: string; quantity: number }) => unknown;
}

interface ModelContext {
	registerTool?: (tool: ModelContextTool) => unknown;
}

const MATERIAL_LABEL: Record<ProductMaterial, string> = {
	Скло: 'Скляна пляшка',
	Банка: 'Алюмінієва банка',
};

@Component({
	imports: [MoneyPipe, RouterLink],
	templateUrl: './home.component.html',
})
export class HomeComponent {
	private readonly _cartService = inject(CartService);
	private readonly _toastService = inject(ToastService);

	protected readonly catalog = inject(CatalogService);
	protected readonly productType = productType;
	protected readonly productImageAlt = productImageAlt;

	protected readonly brands = [
		{ value: 'Arden', title: 'Panacea Arden', subtitle: 'Лікувально-столова' },
		{ value: 'Diamond', title: 'Panacea Diamond', subtitle: 'Артезіанська питна' },
	] as const;
	protected readonly gasOptions = PRODUCT_GASES.map((value) => ({
		value,
		label: value,
		count: PRODUCTS.filter((p) => p.gas === value).length,
	}));
	protected readonly materialOptions = PRODUCT_MATERIALS.map((value) => ({
		value,
		label: MATERIAL_LABEL[value],
		count: PRODUCTS.filter((p) => p.material === value).length,
	}));
	protected readonly totalCount = PRODUCTS.length;

	protected readonly mobileFiltersOpen = signal(false);
	protected readonly quantities = signal<Record<string, number>>(
		Object.fromEntries(PRODUCTS.map((p) => [p.id, 1])),
	);

	protected readonly resultsLabel = computed(() => {
		const count = this.catalog.products().length;
		const noun = count === 1 ? 'товар' : count >= 2 && count <= 4 ? 'товари' : 'товарів';

		return `${count} ${noun}`;
	});
	protected readonly mobileGas = computed(() => _single(this.catalog.gases()));
	protected readonly mobileMaterial = computed(() => _single(this.catalog.materials()));

	constructor() {
		const document = inject(DOCUMENT);

		afterNextRender(() => this._registerModelContextTool(document));
	}

	protected brandCount(brand: string) {
		return PRODUCTS.filter((p) => p.brand === brand).length;
	}

	protected setBrand(brand: CatalogBrand) {
		this.catalog.brand.set(brand);
	}

	protected setSort(sort: string) {
		this.catalog.sort.set(sort as CatalogSort);
	}

	protected toggleGas(gas: ProductGas, checked: boolean) {
		this.catalog.gases.update((gases) =>
			checked ? [...gases, gas] : gases.filter((value) => value !== gas),
		);
	}

	protected toggleMaterial(material: ProductMaterial, checked: boolean) {
		this.catalog.materials.update((materials) =>
			checked ? [...materials, material] : materials.filter((value) => value !== material),
		);
	}

	protected setMobileGas(value: string) {
		this.catalog.gases.set(value === 'all' ? [] : [value as ProductGas]);
	}

	protected setMobileMaterial(value: string) {
		this.catalog.materials.set(value === 'all' ? [] : [value as ProductMaterial]);
	}

	protected step(product: Product, delta: number) {
		const next = this.quantities()[product.id]! + delta;

		if (isValidQuantity(next)) {
			this.quantities.update((quantities) => ({ ...quantities, [product.id]: next }));
		}
	}

	protected setQuantity(product: Product, input: HTMLInputElement) {
		const value = Number(input.value);

		if (isValidQuantity(value)) {
			this.quantities.update((quantities) => ({ ...quantities, [product.id]: value }));
		}

		input.value = String(this.quantities()[product.id]);
	}

	protected addToCart(product: Product, input: HTMLInputElement) {
		this.setQuantity(product, input);
		this._add(product.id, this.quantities()[product.id]!);
	}

	protected quantityLabel(product: Product) {
		return `Кількість ${product.brand}, ${product.gas.toLowerCase()}, ${product.material.toLowerCase()}`;
	}

	private _add(id: string, quantity: number) {
		this._cartService.add(id, quantity);
		this._toastService.show(`Додано до кошика: ${quantity} шт.`);

		return { items: { ...this._cartService.cart() } };
	}

	/** Lets in-browser AI agents (WebMCP) add products to the cart. */
	private _registerModelContextTool(document: Document) {
		const modelContext = (document as Document & { modelContext?: ModelContext }).modelContext;

		if (!modelContext?.registerTool) {
			return;
		}

		try {
			Promise.resolve(
				modelContext.registerTool({
					name: 'add_products_to_cart',
					description: 'Додати вибраний товар PANACEA до кошика. Не оформлює замовлення.',
					inputSchema: {
						type: 'object',
						properties: {
							productId: { type: 'string', enum: PRODUCTS.map((p) => p.id) },
							quantity: { type: 'integer', minimum: 1 },
						},
						required: ['productId', 'quantity'],
						additionalProperties: false,
					},
					annotations: { readOnlyHint: false },
					execute: (input) => this._add(input.productId, input.quantity),
				}),
			).catch(() => {});
		} catch {}
	}
}

function _single(values: string[]): string {
	return values.length === 1 ? values[0]! : 'all';
}
