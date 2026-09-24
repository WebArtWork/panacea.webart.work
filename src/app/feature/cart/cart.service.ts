import { computed, effect, inject, Service, signal } from '@angular/core';
import { StoreService } from '@wawjs/ngx-core';
import { AdminService } from '../admin/admin.service';
import { PRODUCTS } from '../product/product.data';
import { Product } from '../product/product.interface';
import { CART_STORE_KEY } from './cart.const';
import { Cart, CartLine } from './cart.interface';

@Service()
export class CartService {
	private readonly _storeService = inject(StoreService);
	private readonly _adminService = inject(AdminService);

	readonly cart = signal<Cart>({});
	readonly loaded = signal(false);
	readonly count = computed(() => cartCount(this.cart()));

	constructor() {
		effect(() => {
			if (this._adminService.loaded() && !this.loaded()) {
				void this._restore();
			}
		});
	}

	add(id: string, quantity: number) {
		const next = (this.cart()[id] ?? 0) + quantity;
		const product = this._adminService.products().find((item) => item.id === id);

		if (
			!product ||
			!isValidQuantity(quantity) ||
			!isValidQuantity(next) ||
			next > product.stock
		) {
			throw new Error('Некоректний товар або кількість');
		}

		this.replace({ ...this.cart(), [id]: next });
	}

	setQuantity(id: string, quantity: number) {
		const product = this._adminService.products().find((item) => item.id === id);

		if (product && isValidQuantity(quantity) && quantity <= product.stock) {
			this.replace({ ...this.cart(), [id]: quantity });
		}
	}

	remove(id: string) {
		const { [id]: _removed, ...rest } = this.cart();
		this.replace(rest);
	}

	replace(cart: Cart) {
		this.cart.set(cart);
		void this._storeService.setJson(CART_STORE_KEY, cart);
	}

	clear() {
		this.cart.set({});
		void this._storeService.remove(CART_STORE_KEY);
	}

	private async _restore() {
		const saved = await this._storeService.getJson<Cart>(CART_STORE_KEY, {
			clearOnError: true,
		});
		const cart: Cart = {};

		for (const product of this._adminService.products()) {
			const quantity = saved?.[product.id];

			if (typeof quantity === 'number' && isValidQuantity(quantity)) {
				cart[product.id] = quantity;
			}
		}

		this.cart.set(cart);
		this.loaded.set(true);
	}
}

export function cartCount(cart: Cart): number {
	return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
}

export function cartLines(cart: Cart, products: Product[] = PRODUCTS): CartLine[] {
	return products.filter((product) => cart[product.id]).map((product) => ({
		product,
		quantity: cart[product.id]!,
		total: product.price * cart[product.id]!,
	}));
}

export function isValidQuantity(value: number): boolean {
	return Number.isSafeInteger(value) && value >= 1;
}
