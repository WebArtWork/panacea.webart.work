import { RenderMode, ServerRoute } from '@angular/ssr';
import { PRODUCTS } from './feature/product/product.data';

export const serverRoutes: ServerRoute[] = [
	{
		path: 'product/:id',
		renderMode: RenderMode.Prerender,
		async getPrerenderParams() {
			return PRODUCTS.map((product) => ({ id: product.id }));
		},
	},
	{
		// Order ids are generated at checkout by Firestore — nothing static to prerender.
		path: 'order/:id',
		renderMode: RenderMode.Client,
	},
	{
		// Auth state and order data only exist in the browser (Firebase). Prerendering/SSR would run
		// the admin auth check with no signed-in user, baking a permanent "redirect to sign-in" into
		// the static output — these must render purely client-side so the real, live session is checked.
		path: 'admin',
		renderMode: RenderMode.Client,
	},
	{
		path: 'admin/products',
		renderMode: RenderMode.Client,
	},
	{
		path: 'admin/orders',
		renderMode: RenderMode.Client,
	},
	{
		path: 'admin/customers',
		renderMode: RenderMode.Client,
	},
	{
		path: 'admin/sign',
		renderMode: RenderMode.Client,
	},
	{
		path: '**',
		renderMode: RenderMode.Prerender,
	},
];
