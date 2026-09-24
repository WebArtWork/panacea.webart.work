export type ProductGas = 'Негазована' | 'Слабогазована' | 'Сильногазована';

export type ProductMaterial = 'Скло' | 'Банка';

export interface Product {
	id: string;
	brand: string;
	category: string;
	gas: ProductGas;
	material: ProductMaterial;
	volumeMl: number;
	image: string | null;
	price: number;
	stock: number;
	popularity: number;
	isNew: boolean;
	isHit: boolean;
}
