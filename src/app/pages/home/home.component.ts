import { DOCUMENT } from '@angular/common';
import { afterNextRender, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService, isValidQuantity } from '../../feature/cart/cart.service';
import { CatalogBrand, CatalogService, CatalogSort } from '../../feature/catalog/catalog.service';
import {
	PRODUCT_GASES,
	PRODUCT_MATERIALS,
	formatVolume,
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

type CatalogView = 'grid' | 'list';

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
	protected readonly formatVolume = formatVolume;

	protected readonly brands = [
		{ value: 'Arden', title: 'Panacea Arden', subtitle: 'Лікувально-столова' },
		{ value: 'Diamond', title: 'Panacea Diamond', subtitle: 'Артезіанська питна' },
	] as const;
	protected readonly gasOptions = computed(() =>
		PRODUCT_GASES.map((value) => ({
			value,
			label: value,
			count: this.catalog.allProducts().filter((p) => p.gas === value).length,
		})),
	);
	protected readonly materialOptions = computed(() =>
		PRODUCT_MATERIALS.map((value) => ({
			value,
			label: MATERIAL_LABEL[value],
			count: this.catalog.allProducts().filter((p) => p.material === value).length,
		})),
	);
	protected readonly volumeOptions = computed(() =>
		[...new Set(this.catalog.allProducts().map((product) => product.volumeMl))]
			.sort((a, b) => a - b)
			.map((value) => ({
				value,
				label: formatVolume(value),
				count: this.catalog.allProducts().filter((p) => p.volumeMl === value).length,
			})),
	);
	protected readonly totalCount = computed(() => this.catalog.allProducts().length);
	protected readonly inStockCount = computed(
		() => this.catalog.allProducts().filter((product) => product.stock > 0).length,
	);

	protected readonly mobileFiltersOpen = signal(false);
	protected readonly viewMode = signal<CatalogView>('grid');
	protected readonly quantities = signal<Record<string, number>>(
		Object.fromEntries(this.catalog.allProducts().map((p) => [p.id, 1])),
	);

	protected readonly resultsLabel = computed(() => {
		const count = this.catalog.products().length;
		const noun = count === 1 ? 'товар' : count >= 2 && count <= 4 ? 'товари' : 'товарів';

		return `${count} ${noun}`;
	});
	protected readonly mobileGas = computed(() => _single(this.catalog.gases()));
	protected readonly mobileMaterial = computed(() => _single(this.catalog.materials()));
	protected readonly mobileVolume = computed(() => _single(this.catalog.volumes()));

	constructor() {
		const document = inject(DOCUMENT);

		afterNextRender(() => this._registerModelContextTool(document));
	}

	protected brandCount(brand: string) {
		return this.catalog.allProducts().filter((p) => p.brand === brand).length;
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

	protected toggleVolume(volumeMl: number, checked: boolean) {
		this.catalog.volumes.update((volumes) =>
			checked ? [...volumes, volumeMl] : volumes.filter((value) => value !== volumeMl),
		);
	}

	protected setMobileGas(value: string) {
		this.catalog.gases.set(value === 'all' ? [] : [value as ProductGas]);
	}

	protected setMobileMaterial(value: string) {
		this.catalog.materials.set(value === 'all' ? [] : [value as ProductMaterial]);
	}

	protected setMobileVolume(value: string) {
		this.catalog.volumes.set(value === 'all' ? [] : [Number(value)]);
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
		if (product.stock === 0) {
			return;
		}

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
							productId: { type: 'string', enum: this.catalog.allProducts().map((p) => p.id) },
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

function _single<T extends string | number>(values: T[]): T | 'all' {
	return values.length === 1 ? values[0]! : 'all';
}
