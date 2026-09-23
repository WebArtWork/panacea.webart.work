import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DEMO_CART, DEMO_CUSTOMER } from '../../feature/cart/cart.const';
import { cartLines } from '../../feature/cart/cart.service';
import { MoneyPipe } from '../../pipes/money.pipe';

@Component({
	imports: [MoneyPipe, RouterLink],
	templateUrl: './account.component.html',
})
export class AccountComponent {
	protected readonly customer = DEMO_CUSTOMER;
	protected readonly lines = cartLines(DEMO_CART);
	protected readonly total = this.lines.reduce((sum, line) => sum + line.total, 0);
}
