import { Cart } from './cart.interface';

export const CART_STORE_KEY = 'panacea-cart';

/** Sample cart shown on the cart, checkout, and order pages while the real cart is empty. */
export const DEMO_CART: Cart = { 'arden-glass': 2, 'diamond-light-glass': 1 };

export const DEMO_CUSTOMER = {
	name: 'Олена Ковальчук',
	phone: '+38 067 123 45 67',
	city: 'Київ',
	address: 'вул. Хрещатик, 22, кв. 5',
	comment: '',
	payment: 'Готівкою при отриманні',
};
