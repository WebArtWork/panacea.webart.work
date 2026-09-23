import { computed, inject, Service, signal } from '@angular/core';
import { StoreService } from '@wawjs/ngx-core';
import { PRODUCTS } from '../product/product.data';
import { CART_STORE_KEY } from './cart.const';
import { Cart, CartLine } from './cart.interface';

@Service()
export class CartService {
	private readonly _storeService = inject(StoreService);

	readonly cart = signal<Cart>({});
	readonly loaded = signal(false);
	readonly count = computed(() => cartCount(this.cart()));

	constructor() {
		void this._restore();
	}

	add(id: string, quantity: number) {
		const next = (this.cart()[id] ?? 0) + quantity;

		if (!isValidQuantity(quantity) || !isValidQuantity(next) || !PRODUCTS.some((p) => p.id === id)) {
			throw new Error('Некоректний товар або кількість');
		}

		this.replace({ ...this.cart(), [id]: next });
	}

	setQuantity(id: string, quantity: number) {
		if (isValidQuantity(quantity)) {
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
		const saved = await this._storeService.getJson<Cart>(CART_STORE_KEY, { clearOnError: true });
		const cart: Cart = {};

		for (const product of PRODUCTS) {
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

export function cartLines(cart: Cart): CartLine[] {
	return PRODUCTS.filter((product) => cart[product.id]).map((product) => ({
		product,
		quantity: cart[product.id]!,
		total: product.price * cart[product.id]!,
	}));
}

export function isValidQuantity(value: number): boolean {
	return Number.isSafeInteger(value) && value >= 1;
}
