import { Pipe, PipeTransform } from '@angular/core';
import { OrderItem } from '../feature/order/order.interface';

/** Formats an order's line items as a compact "Arden × 2, Diamond × 1" summary for admin tables. */
@Pipe({ name: 'orderSummary' })
export class OrderSummaryPipe implements PipeTransform {
	transform(items: OrderItem[]): string {
		return items.map((item) => `${item.brand} × ${item.quantity}`).join(', ');
	}
}
