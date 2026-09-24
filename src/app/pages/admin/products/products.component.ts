import { Component, inject, signal, viewChild } from '@angular/core';
import { AdminService, ProductDraft } from '../../../feature/admin/admin.service';
import {
	formatVolume,
	PRODUCT_GASES,
	PRODUCT_MATERIALS,
} from '../../../feature/product/product.data';
import { Product } from '../../../feature/product/product.interface';
import { MoneyPipe } from '../../../pipes/money.pipe';

@Component({
	imports: [MoneyPipe],
	templateUrl: './products.component.html',
})
export class ProductsComponent {
	protected readonly adminService = inject(AdminService);
	protected readonly gases = PRODUCT_GASES;
	protected readonly materials = PRODUCT_MATERIALS;
	protected readonly formatVolume = formatVolume;

	protected readonly dialog = viewChild.required<{ nativeElement: HTMLDialogElement }>(
		'editDialog',
	);
	protected readonly editing = signal<Product | null>(null);

	protected openForCreate() {
		this.editing.set(null);
		this.dialog().nativeElement.showModal();
	}

	protected openForEdit(product: Product) {
		this.editing.set(product);
		this.dialog().nativeElement.showModal();
	}

	protected closeDialog() {
		this.dialog().nativeElement.close();
	}

	protected deleteProduct(product: Product) {
		if (
			confirm(
				`Видалити товар PANACEA ${product.brand} (${product.gas.toLowerCase()}, ${product.material.toLowerCase()})? Цю дію не можна скасувати.`,
			)
		) {
			this.adminService.deleteProduct(product.id);
		}
	}

	protected submit(event: SubmitEvent) {
		event.preventDefault();

		const form = event.target as HTMLFormElement;
		const data = new FormData(form);
		const brand = String(data.get('brand') ?? '').trim();
		const price = Number(data.get('price'));
		const stock = Number(data.get('stock'));
		const volumeMl = Number(data.get('volumeMl'));
		const popularity = Number(data.get('popularity'));

		if (
			!brand ||
			!Number.isFinite(price) ||
			price < 0 ||
			!Number.isInteger(stock) ||
			stock < 0 ||
			!Number.isInteger(volumeMl) ||
			volumeMl <= 0 ||
			!Number.isInteger(popularity) ||
			popularity < 0 ||
			popularity > 100
		) {
			return;
		}

		const draft: ProductDraft = {
			brand,
			gas: data.get('gas') as ProductDraft['gas'],
			material: data.get('material') as ProductDraft['material'],
			volumeMl,
			price,
			stock,
			popularity,
			isNew: data.get('isNew') === 'on',
			isHit: data.get('isHit') === 'on',
		};

		const editing = this.editing();

		if (editing) {
			this.adminService.saveProduct(editing.id, draft);
		} else {
			this.adminService.addProduct(draft);
		}

		this.dialog().nativeElement.close();
	}
}
