import { Product } from '../product/product.interface';

/** Product id → quantity. */
export type Cart = Record<string, number>;

export interface CartLine {
	product: Product;
	quantity: number;
	total: number;
}
