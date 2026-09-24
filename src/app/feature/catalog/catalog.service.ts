import { computed, inject, Service, signal } from '@angular/core';
import { AdminService } from '../admin/admin.service';
import { formatVolume } from '../product/product.data';
import { ProductGas, ProductMaterial } from '../product/product.interface';

export type CatalogBrand = 'all' | 'Arden' | 'Diamond';

export type CatalogSort = 'popularity' | 'new' | 'asc' | 'desc';

/** Catalog filter state, shared by the header search and the home page. */
@Service()
export class CatalogService {
	private readonly _adminService = inject(AdminService);

	readonly allProducts = this._adminService.products;
	readonly query = signal('');
	readonly brand = signal<CatalogBrand>('all');
	readonly gases = signal<ProductGas[]>([]);
	readonly materials = signal<ProductMaterial[]>([]);
	readonly volumes = signal<number[]>([]);
	readonly inStockOnly = signal(false);
	readonly sort = signal<CatalogSort>('popularity');

	readonly products = computed(() => {
		const query = this.query().trim().toLocaleLowerCase('uk-UA');
		const brand = this.brand();
		const gases = this.gases();
		const materials = this.materials();
		const volumes = this.volumes();
		const inStockOnly = this.inStockOnly();
		const sort = this.sort();

		const selected = this.allProducts().filter(
			(p) =>
				(brand === 'all' || p.brand === brand) &&
				(!gases.length || gases.includes(p.gas)) &&
				(!materials.length || materials.includes(p.material)) &&
				(!volumes.length || volumes.includes(p.volumeMl)) &&
				(!inStockOnly || p.stock > 0) &&
				`panacea ${p.brand} ${p.category} ${p.gas} ${p.material} ${formatVolume(p.volumeMl)}`
					.toLocaleLowerCase('uk-UA')
					.includes(query),
		);

		selected.sort((a, b) => {
			if (sort === 'new') {
				return Number(b.isNew) - Number(a.isNew) || b.popularity - a.popularity;
			}

			return sort === 'popularity'
				? b.popularity - a.popularity
				: sort === 'asc'
					? a.price - b.price
					: b.price - a.price;
		});

		return selected;
	});

	reset() {
		this.brand.set('all');
		this.query.set('');
		this.gases.set([]);
		this.materials.set([]);
		this.volumes.set([]);
		this.inStockOnly.set(false);
	}
}
