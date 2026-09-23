import { computed, inject, Service, signal } from '@angular/core';
import { StoreService } from '@wawjs/ngx-core';
import customersData from '../../../data/customer/customers.json';
import { PRODUCTS } from '../product/product.data';
import { Product } from '../product/product.interface';
import { AdminCustomer } from './admin.interface';

export const ADMIN_CUSTOMERS = customersData as AdminCustomer[];

export type ProductDraft = Pick<Product, 'brand' | 'gas' | 'material' | 'price' | 'stock'>;

const KEYS = {
	productOverrides: 'panacea-admin-products',
	productsAdded: 'panacea-admin-products-added',
	productsDeleted: 'panacea-admin-products-deleted',
};

/**
 * Demo catalog CRM state. Product edits are kept in this browser's storage on top of the shipped
 * catalog — there is no backend for products/customers. Orders are real: see `OrderService`.
 */
@Service()
export class AdminService {
	private readonly _storeService = inject(StoreService);

	private readonly _productOverrides = signal<Record<string, Partial<Product>>>({});
	private readonly _productsAdded = signal<Product[]>([]);
	private readonly _productsDeleted = signal<string[]>([]);

	readonly loaded = signal(false);

	readonly products = computed(() => {
		const overrides = this._productOverrides();
		const deleted = this._productsDeleted();

		return [...PRODUCTS.filter((p) => !deleted.includes(p.id)), ...this._productsAdded()].map(
			(p) => ({ ...p, ...overrides[p.id] }),
		);
	});

	constructor() {
		void this._restore();
	}

	saveProduct(id: string, data: ProductDraft) {
		this._productOverrides.update((overrides) => ({
			...overrides,
			[id]: { ...overrides[id], ...data },
		}));
		void this._storeService.setJson(KEYS.productOverrides, this._productOverrides());
	}

	addProduct(data: ProductDraft) {
		const id = `${data.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;

		this._productsAdded.update((added) => [
			...added,
			{ id, ...data, category: '', image: 'diamond-1.webp' },
		]);
		void this._storeService.setJson(KEYS.productsAdded, this._productsAdded());
	}

	deleteProduct(id: string) {
		if (this._productsAdded().some((p) => p.id === id)) {
			this._productsAdded.update((added) => added.filter((p) => p.id !== id));
			void this._storeService.setJson(KEYS.productsAdded, this._productsAdded());
			return;
		}

		if (!this._productsDeleted().includes(id)) {
			this._productsDeleted.update((deleted) => [...deleted, id]);
			void this._storeService.setJson(KEYS.productsDeleted, this._productsDeleted());
		}
	}

	private async _restore() {
		const [overrides, added, deleted] = await Promise.all([
			this._read<Record<string, Partial<Product>>>(KEYS.productOverrides, {}),
			this._read<Product[]>(KEYS.productsAdded, []),
			this._read<string[]>(KEYS.productsDeleted, []),
		]);

		this._productOverrides.set(overrides);
		this._productsAdded.set(added);
		this._productsDeleted.set(deleted);
		this.loaded.set(true);
	}

	private async _read<T>(key: string, fallback: T): Promise<T> {
		return (await this._storeService.getJson<T>(key, { clearOnError: true })) ?? fallback;
	}
}
