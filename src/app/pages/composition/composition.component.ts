import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface MineralRow {
	label: string;
	unit: string;
}

const MINERAL_ROWS: MineralRow[] = [
	{ label: 'Натрій + Калій (Na + K)', unit: 'мг/дм³' },
	{ label: 'Магній (Mg)', unit: 'мг/дм³' },
	{ label: 'Кальцій (Ca)', unit: 'мг/дм³' },
	{ label: 'Хлориди (Cl)', unit: 'мг/дм³' },
	{ label: 'Гідрокарбонати (HCO₃)', unit: 'мг/дм³' },
	{ label: 'Сульфати (SO₄)', unit: 'мг/дм³' },
	{ label: 'Загальний органічний вуглець (TOC)', unit: 'мг/дм³' },
	{ label: 'Метакремнієва кислота (H₂SiO₃)', unit: 'мг/дм³' },
	{ label: 'Мінералізація', unit: 'мг/дм³' },
];

@Component({
	imports: [RouterLink],
	templateUrl: './composition.component.html',
})
export class CompositionComponent {
	protected readonly rows = MINERAL_ROWS;
}
