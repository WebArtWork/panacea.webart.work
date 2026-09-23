import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface FaqItem {
	question: string;
	answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
	{
		question: 'Скільки коштує доставка?',
		answer:
			'Вартість доставки Новою поштою розраховується за тарифами перевізника залежно від ваги, обсягу та міста. Точну суму бачите під час оформлення замовлення.',
	},
	{
		question: 'Чи є мінімальна сума замовлення?',
		answer: 'Ні, замовляти можна від однієї пляшки чи банки — без мінімальної суми.',
	},
	{
		question: 'Коли відправляють замовлення?',
		answer: 'Після підтвердження замовлення менеджером по телефону — зазвичай протягом 1–2 робочих днів.',
	},
];

@Component({
	imports: [RouterLink],
	templateUrl: './delivery.component.html',
})
export class DeliveryComponent {
	protected readonly faqItems = FAQ_ITEMS;
}
