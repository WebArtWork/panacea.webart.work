import { Component } from '@angular/core';
import { ADMIN_CUSTOMERS } from '../../../feature/admin/admin.service';
import { MoneyPipe } from '../../../pipes/money.pipe';

@Component({
	imports: [MoneyPipe],
	templateUrl: './customers.component.html',
})
export class CustomersComponent {
	protected readonly customers = ADMIN_CUSTOMERS;
}
