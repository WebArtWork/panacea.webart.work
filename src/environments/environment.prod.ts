export const environment: {
	apiUrl: string;
	appVersion: string;
	production: boolean;
	companyId: string;
	defaultLanguage: string;
	languages: AppLanguage[];
	firebase: FirebaseConfig;
} = {
	apiUrl: 'https://it.webart.work',
	appVersion: '1.0.0',
	production: true,
	// Empty until PANACEA has a company record on the shared backend; bootstrap then uses local data only.
	companyId: '',
	defaultLanguage: 'ua',
	languages: [
		{
			code: 'ua',
			name: 'Ukrainian',
			nativeName: 'Українська',
			htmlLang: 'uk',
		},
	],
	// Firebase Auth (admin login) and Firestore (orders). This web config is not secret — it only
	// identifies the project; access is enforced by Firestore security rules, not by hiding this.
	firebase: {
		apiKey: 'AIzaSyBQgms9vPnL7nBmi8V4WADVOetjfhaXwyg',
		authDomain: 'panacea-d74d5.firebaseapp.com',
		projectId: 'panacea-d74d5',
		storageBucket: 'panacea-d74d5.firebasestorage.app',
		messagingSenderId: '412795815129',
		appId: '1:412795815129:web:ad140907f1fd5a37d42ac8',
	},
};

export interface AppLanguage {
	code: string;
	name: string;
	nativeName: string;
	htmlLang: string;
}

export interface FirebaseConfig {
	apiKey: string;
	authDomain: string;
	projectId: string;
	storageBucket: string;
	messagingSenderId: string;
	appId: string;
}
