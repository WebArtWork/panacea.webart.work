import { Component, computed, inject, signal } from '@angular/core';
import { AdminService, ADMIN_CUSTOMERS } from '../../../feature/admin/admin.service';
import { Order, ORDER_STATUS_LABEL } from '../../../feature/order/order.interface';
import { OrderService } from '../../../feature/order/order.service';
import { MoneyPipe } from '../../../pipes/money.pipe';
import { OrderSummaryPipe } from '../../../pipes/order-summary.pipe';

@Component({
	imports: [MoneyPipe, OrderSummaryPipe],
	templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
	private readonly _orderService = inject(OrderService);

	protected readonly adminService = inject(AdminService);
	protected readonly statusLabel = ORDER_STATUS_LABEL;
	protected readonly customerCount = ADMIN_CUSTOMERS.length;

	protected readonly orders = signal<Order[]>([]);
	protected readonly ordersLoading = signal(true);

	protected readonly recentOrders = computed(() => this.orders().slice(0, 5));
	protected readonly totalRevenue = computed(() => this.orders().reduce((sum, order) => sum + order.total, 0));
	protected readonly lowStock = computed(() => this.adminService.products().filter((p) => p.stock <= 20));

	constructor() {
		void this._loadOrders();
	}

	private async _loadOrders() {
		this.orders.set(await this._orderService.getAll());
		this.ordersLoading.set(false);
	}
}
