import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { cartLines, CartService, isValidQuantity } from '../../feature/cart/cart.service';
import { DEMO_CART } from '../../feature/cart/cart.const';
import { CartLine } from '../../feature/cart/cart.interface';
import { MoneyPipe } from '../../pipes/money.pipe';

@Component({
	imports: [MoneyPipe, RouterLink],
	templateUrl: './cart.component.html',
})
export class CartComponent {
	protected readonly cartService = inject(CartService);

	/** True while the real cart is empty and the demo cart is shown instead. */
	protected readonly isDemo = computed(() => this.cartService.loaded() && !this.cartService.count());
	protected readonly lines = computed<CartLine[]>(() =>
		cartLines(this.isDemo() ? DEMO_CART : this.cartService.cart()),
	);
	protected readonly total = computed(() => this.lines().reduce((sum, line) => sum + line.total, 0));

	protected step(id: string, delta: number) {
		const line = this.lines().find((l) => l.product.id === id);
		const next = (line?.quantity ?? 0) + delta;

		if (isValidQuantity(next)) {
			this.cartService.setQuantity(id, next);
		}
	}

	protected setQuantity(id: string, input: HTMLInputElement) {
		const value = Number(input.value);

		if (isValidQuantity(value)) {
			this.cartService.setQuantity(id, value);
		} else {
			input.value = String(this.lines().find((l) => l.product.id === id)?.quantity ?? 1);
		}
	}

	protected remove(id: string) {
		this.cartService.remove(id);
	}
}
