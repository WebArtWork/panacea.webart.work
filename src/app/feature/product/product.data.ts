import productsData from '../../../data/product/products.json';
import { Product } from './product.interface';

export const PRODUCTS = productsData as Product[];

export const PRODUCT_GASES = ['Негазована', 'Слабогазована', 'Сильногазована'] as const;

export const PRODUCT_MATERIALS = ['Скло', 'Банка'] as const;

export const PRODUCT_VOLUMES = [...new Set(PRODUCTS.map((product) => product.volumeMl))].sort(
	(a, b) => a - b,
);

export function findProduct(id: string | null | undefined): Product | undefined {
	return PRODUCTS.find((product) => product.id === id);
}

export function productType(product: Product): string {
	return product.brand === 'Arden' ? 'Мінеральна лікувально-столова' : 'Артезіанська питна вода';
}

export function productImageAlt(product: Product): string {
	return `PANACEA ${product.brand}, ${product.gas.toLowerCase()}, ${product.material.toLowerCase()}, ${formatVolume(product.volumeMl)}`;
}

export function formatVolume(volumeMl: number): string {
	return `${new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 }).format(volumeMl / 1000)} л`;
}

export function formatMoney(value: number): string {
	return `${new Intl.NumberFormat('uk-UA').format(value)} ₴`;
}
