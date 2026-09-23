import { Service, signal } from '@angular/core';

@Service()
export class ToastService {
	readonly message = signal('');
	readonly visible = signal(false);

	private _timer?: ReturnType<typeof setTimeout>;

	show(message: string) {
		this.message.set(message);
		this.visible.set(true);
		clearTimeout(this._timer);
		this._timer = setTimeout(() => this.visible.set(false), 2500);
	}
}
