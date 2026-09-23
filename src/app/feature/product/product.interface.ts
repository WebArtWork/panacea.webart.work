export type ProductGas = 'Негазована' | 'Слабогазована' | 'Сильногазована';

export type ProductMaterial = 'Скло' | 'Банка';

export interface Product {
	id: string;
	brand: string;
	category: string;
	gas: ProductGas;
	material: ProductMaterial;
	image: string;
	price: number;
	stock: number;
}
