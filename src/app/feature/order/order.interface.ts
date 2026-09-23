export type OrderStatus = 'new' | 'processing' | 'done';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
	new: 'Нове',
	processing: 'В обробці',
	done: 'Виконано',
};

export interface OrderItem {
	brand: string;
	gas: string;
	material: string;
	quantity: number;
	price: number;
}

/** An order placed from the checkout page. */
export interface Order {
	id: string;
	date: string;
	status: OrderStatus;
	name: string;
	phone: string;
	city: string;
	address: string;
	comment: string;
	payment: string;
	items: OrderItem[];
	total: number;
}
