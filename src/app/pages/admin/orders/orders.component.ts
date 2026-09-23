import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Order, OrderStatus, ORDER_STATUS_LABEL } from '../../../feature/order/order.interface';
import { OrderService } from '../../../feature/order/order.service';
import { MoneyPipe } from '../../../pipes/money.pipe';
import { OrderSummaryPipe } from '../../../pipes/order-summary.pipe';

const STATUSES = Object.keys(ORDER_STATUS_LABEL) as OrderStatus[];

@Component({
	imports: [DatePipe, MoneyPipe, OrderSummaryPipe],
	templateUrl: './orders.component.html',
})
export class OrdersComponent {
	private readonly _orderService = inject(OrderService);

	protected readonly statusLabel = ORDER_STATUS_LABEL;
	protected readonly statuses = STATUSES;

	protected readonly orders = signal<Order[]>([]);
	protected readonly loading = signal(true);

	constructor() {
		void this._load();
	}

	protected async setStatus(orderId: string, select: HTMLSelectElement) {
		const status = select.value as OrderStatus;

		this.orders.update((list) => list.map((order) => (order.id === orderId ? { ...order, status } : order)));
		await this._orderService.updateStatus(orderId, status);
	}

	private async _load() {
		this.orders.set(await this._orderService.getAll());
		this.loading.set(false);
	}
}
