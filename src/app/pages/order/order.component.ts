import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Order, ORDER_STATUS_LABEL } from '../../feature/order/order.interface';
import { OrderService } from '../../feature/order/order.service';
import { MoneyPipe } from '../../pipes/money.pipe';

@Component({
	imports: [MoneyPipe, RouterLink],
	templateUrl: './order.component.html',
})
export class OrderComponent {
	private readonly _orderService = inject(OrderService);

	readonly id = input<string>();

	protected readonly statusLabel = ORDER_STATUS_LABEL;

	/** undefined = loading, null = not found, Order = loaded. */
	protected readonly order = signal<Order | null | undefined>(undefined);
	protected readonly orderDate = computed(() => {
		const order = this.order();

		return order ? new Date(order.date).toLocaleString('uk-UA', { dateStyle: 'long', timeStyle: 'short' }) : '';
	});

	constructor() {
		const id = this.id();

		if (id) {
			void this._orderService.getById(id).then((order) => this.order.set(order));
		} else {
			this.order.set(null);
		}
	}
}
