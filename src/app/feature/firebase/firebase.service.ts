import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, Service } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { environment } from '../../../environments/environment';

/**
 * Lazily initializes the Firebase app on the browser only.
 * SSR/prerender never touches Firebase — there is nothing to hydrate,
 * and the JS SDK isn't SSR-safe (it talks to the network on read).
 */
@Service()
export class FirebaseService {
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	private _app: FirebaseApp | null = null;
	private _firestore: Firestore | null = null;
	private _auth: Auth | null = null;

	get app(): FirebaseApp | null {
		if (!this._isBrowser) {
			return null;
		}

		if (!this._app) {
			this._app = initializeApp(environment.firebase);
		}

		return this._app;
	}

	get firestore(): Firestore | null {
		if (!this._isBrowser) {
			return null;
		}

		if (!this._firestore) {
			const app = this.app;

			this._firestore = app ? getFirestore(app) : null;
		}

		return this._firestore;
	}

	get auth(): Auth | null {
		if (!this._isBrowser) {
			return null;
		}

		if (!this._auth) {
			const app = this.app;

			// getAuth() already defaults to browserLocalPersistence on the web —
			// no need to (and don't) call setPersistence() again here; doing so
			// races Firebase's own session-restore flow on reload.
			this._auth = app ? getAuth(app) : null;
		}

		return this._auth;
	}
}
