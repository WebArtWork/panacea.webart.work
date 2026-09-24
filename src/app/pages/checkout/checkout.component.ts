import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DEMO_CART, DEMO_CUSTOMER } from '../../feature/cart/cart.const';
import { cartLines, CartService } from '../../feature/cart/cart.service';
import { Order } from '../../feature/order/order.interface';
import { OrderService } from '../../feature/order/order.service';
import { MoneyPipe } from '../../pipes/money.pipe';
import { formatVolume } from '../../feature/product/product.data';
import { AdminService } from '../../feature/admin/admin.service';

const PAYMENT_LABEL: Record<string, string> = {
	cash: 'Готівкою при отриманні',
	transfer: 'Переказ на картку',
	card: 'Оплата карткою онлайн',
};

@Component({
	imports: [MoneyPipe, RouterLink],
	templateUrl: './checkout.component.html',
})
export class CheckoutComponent {
	private readonly _cartService = inject(CartService);
	private readonly _adminService = inject(AdminService);
	private readonly _orderService = inject(OrderService);
	private readonly _router = inject(Router);

	protected readonly isDemo = computed(
		() => this._cartService.loaded() && !this._cartService.count(),
	);
	protected readonly lines = computed(() =>
		cartLines(this.isDemo() ? DEMO_CART : this._cartService.cart(), this._adminService.products()),
	);
	protected readonly total = computed(() =>
		this.lines().reduce((sum, line) => sum + line.total, 0),
	);
	protected readonly demoCustomer = DEMO_CUSTOMER;
	protected readonly formatVolume = formatVolume;

	protected readonly submitting = signal(false);
	protected readonly error = signal('');

	protected async submit(event: SubmitEvent) {
		event.preventDefault();

		const form = event.target as HTMLFormElement;

		if (!form.checkValidity()) {
			form.reportValidity();
			return;
		}

		const data = new FormData(form);
		const payment = String(data.get('payment') ?? 'cash');
		const lines = this.lines();

		const order: Omit<Order, 'id'> = {
			date: new Date().toISOString(),
			status: 'new',
			name: String(data.get('name') ?? '').trim(),
			phone: String(data.get('phone') ?? '').trim(),
			city: String(data.get('city') ?? '').trim(),
			address: String(data.get('address') ?? '').trim(),
			comment: String(data.get('comment') ?? '').trim(),
			payment: PAYMENT_LABEL[payment] ?? payment,
			items: lines.map(({ product, quantity }) => ({
				brand: product.brand,
				gas: product.gas,
				material: product.material,
				volumeMl: product.volumeMl,
				quantity,
				price: product.price,
			})),
			total: this.total(),
		};

		this.submitting.set(true);
		this.error.set('');

		try {
			const id = await this._orderService.create(order);

			this._cartService.clear();
			void this._router.navigate(['/order', id]);
		} catch {
			this.error.set(
				'Не вдалося оформити замовлення. Спробуйте ще раз або зателефонуйте нам.',
			);
		} finally {
			this.submitting.set(false);
		}
	}
}
