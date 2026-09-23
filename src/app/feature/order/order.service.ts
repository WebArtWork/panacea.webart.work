import { inject, Service } from '@angular/core';
import {
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	setDoc,
	updateDoc,
} from 'firebase/firestore';
import { FirebaseService } from '../firebase/firebase.service';
import { Order, OrderStatus } from './order.interface';

const COLLECTION = 'orders';
const MAX_ID_ATTEMPTS = 5;

/** Orders live in Firestore: anyone can create one at checkout, only signed-in admins can list or update. */
@Service()
export class OrderService {
	private readonly _firebase = inject(FirebaseService);

	async create(order: Omit<Order, 'id'>): Promise<string> {
		const firestore = this._firebase.firestore;

		if (!firestore) {
			throw new Error('Firestore is only available in the browser.');
		}

		for (let attempt = 0; attempt < MAX_ID_ATTEMPTS; attempt++) {
			const id = generateOrderNumber();
			const ref = doc(firestore, COLLECTION, id);

			if ((await getDoc(ref)).exists()) {
				continue;
			}

			await setDoc(ref, order);

			return id;
		}

		throw new Error('Could not generate a unique order number.');
	}

	async getById(id: string): Promise<Order | null> {
		const firestore = this._firebase.firestore;

		if (!firestore) {
			return null;
		}

		const snap = await getDoc(doc(firestore, COLLECTION, id));

		return snap.exists() ? ({ id: snap.id, ...snap.data() } as Order) : null;
	}

	async getAll(): Promise<Order[]> {
		const firestore = this._firebase.firestore;

		if (!firestore) {
			return [];
		}

		const snap = await getDocs(query(collection(firestore, COLLECTION), orderBy('date', 'desc')));

		return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order);
	}

	async updateStatus(id: string, status: OrderStatus): Promise<void> {
		const firestore = this._firebase.firestore;

		if (!firestore) {
			return;
		}

		await updateDoc(doc(firestore, COLLECTION, id), { status });
	}
}

function generateOrderNumber(): string {
	const part = () => String(Math.floor(100 + Math.random() * 900));

	return `ORD-${part()}-${part()}`;
}
