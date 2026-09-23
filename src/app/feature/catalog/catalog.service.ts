import { computed, Service, signal } from '@angular/core';
import { PRODUCTS } from '../product/product.data';
import { ProductGas, ProductMaterial } from '../product/product.interface';

export type CatalogBrand = 'all' | 'Arden' | 'Diamond';

export type CatalogSort = 'default' | 'asc' | 'desc';

/** Catalog filter state, shared by the header search and the home page. */
@Service()
export class CatalogService {
	readonly query = signal('');
	readonly brand = signal<CatalogBrand>('all');
	readonly gases = signal<ProductGas[]>([]);
	readonly materials = signal<ProductMaterial[]>([]);
	readonly sort = signal<CatalogSort>('default');

	readonly products = computed(() => {
		const query = this.query().trim().toLocaleLowerCase('uk-UA');
		const brand = this.brand();
		const gases = this.gases();
		const materials = this.materials();
		const sort = this.sort();

		const selected = PRODUCTS.filter(
			(p) =>
				(brand === 'all' || p.brand === brand) &&
				(!gases.length || gases.includes(p.gas)) &&
				(!materials.length || materials.includes(p.material)) &&
				`panacea ${p.brand} ${p.category} ${p.gas} ${p.material} 0,5 л`
					.toLocaleLowerCase('uk-UA')
					.includes(query),
		);

		if (sort !== 'default') {
			selected.sort((a, b) => (sort === 'asc' ? a.price - b.price : b.price - a.price));
		}

		return selected;
	});

	reset() {
		this.brand.set('all');
		this.query.set('');
		this.gases.set([]);
		this.materials.set([]);
	}
}
