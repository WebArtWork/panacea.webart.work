import { inject, Service, signal } from '@angular/core';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { FirebaseService } from './firebase.service';

@Service()
export class AuthService {
	private readonly _firebase = inject(FirebaseService);

	/** null = signed out, undefined = still resolving initial auth state (SSR / first paint). */
	readonly user = signal<User | null | undefined>(undefined);

	constructor() {
		const auth = this._firebase.auth;

		if (auth) {
			onAuthStateChanged(auth, (user) => this.user.set(user));
		} else {
			// No browser Auth instance (SSR) — nothing to wait for.
			this.user.set(null);
		}
	}

	async signIn(email: string, password: string): Promise<void> {
		const auth = this._firebase.auth;

		if (!auth) {
			throw new Error('Auth is only available in the browser.');
		}

		await signInWithEmailAndPassword(auth, email, password);
	}

	async signOutUser(): Promise<void> {
		const auth = this._firebase.auth;

		if (auth) {
			await signOut(auth);
		}
	}

	/**
	 * Resolves once Firebase's initial auth state resolution is genuinely settled
	 * (restoring a persisted session from storage takes a moment on page load).
	 * `onAuthStateChanged`'s first callback isn't reliably the authoritative one to
	 * wait on for this — `auth.authStateReady()` is the API built for exactly this.
	 */
	async ready(): Promise<User | null> {
		const auth = this._firebase.auth;

		if (!auth) {
			return null;
		}

		await auth.authStateReady();

		return auth.currentUser;
	}
}
