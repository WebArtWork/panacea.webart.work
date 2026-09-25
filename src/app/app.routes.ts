import { Routes } from '@angular/router';
import { buildRouteMeta } from '@wawjs/ngx-default';
import { companyProfile } from './feature/company/company.data';

const meta = (path: string) => buildRouteMeta(companyProfile, path);

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./layouts/store/store.component').then((m) => m.StoreComponent),
		children: [
			{
				path: '',
				data: { meta: meta('/') },
				loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
			},
			{
				path: 'product/:id',
				data: { meta: meta('/product') },
				loadComponent: () =>
					import('./pages/product/product.component').then((m) => m.ProductComponent),
			},
			{
				path: 'cart',
				data: { meta: meta('/cart') },
				loadComponent: () => import('./pages/cart/cart.component').then((m) => m.CartComponent),
			},
			{
				path: 'checkout',
				data: { meta: meta('/checkout') },
				loadComponent: () =>
					import('./pages/checkout/checkout.component').then((m) => m.CheckoutComponent),
			},
			{
				path: 'order/:id',
				data: { meta: meta('/order') },
				loadComponent: () => import('./pages/order/order.component').then((m) => m.OrderComponent),
			},
			{
				path: 'about',
				data: { meta: { ...meta('/about'), titleSuffix: '' } },
				loadComponent: () => import('./pages/about/about.component').then((m) => m.AboutComponent),
			},
			{
				path: 'production',
				data: { meta: meta('/production') },
				loadComponent: () =>
					import('./pages/production/production.component').then((m) => m.ProductionComponent),
			},
			{
				path: 'composition',
				data: { meta: meta('/composition') },
				loadComponent: () =>
					import('./pages/composition/composition.component').then((m) => m.CompositionComponent),
			},
			{
				path: 'certificates',
				data: { meta: meta('/certificates') },
				loadComponent: () =>
					import('./pages/certificates/certificates.component').then((m) => m.CertificatesComponent),
			},
			{
				path: 'delivery',
				data: { meta: meta('/delivery') },
				loadComponent: () =>
					import('./pages/delivery/delivery.component').then((m) => m.DeliveryComponent),
			},
			{
				path: 'partner',
				data: { meta: { ...meta('/partner'), titleSuffix: '' } },
				loadComponent: () => import('./pages/partner/partner.component').then((m) => m.PartnerComponent),
			},
			{
				path: 'contacts',
				data: { meta: meta('/contacts') },
				loadComponent: () =>
					import('./pages/contacts/contacts.component').then((m) => m.ContactsComponent),
			},
			{
				path: 'account',
				data: { meta: meta('/account') },
				loadComponent: () => import('./pages/account/account.component').then((m) => m.AccountComponent),
			},
			{
				path: 'privacy',
				data: { meta: meta('/privacy') },
				loadComponent: () => import('./pages/privacy/privacy.component').then((m) => m.PrivacyComponent),
			},
			{
				path: 'offer',
				data: { meta: meta('/offer') },
				loadComponent: () => import('./pages/offer/offer.component').then((m) => m.OfferComponent),
			},
			{
				path: 'cookies',
				data: { meta: meta('/cookies') },
				loadComponent: () => import('./pages/cookies/cookies.component').then((m) => m.CookiesComponent),
			},
		],
	},
	{
		path: 'admin',
		loadComponent: () => import('./layouts/admin/admin.component').then((m) => m.AdminComponent),
		children: [
			{
				path: '',
				data: { meta: { ...meta('/admin'), titleSuffix: '' } },
				loadComponent: () =>
					import('./pages/admin/dashboard/dashboard.component').then((m) => m.DashboardComponent),
			},
			{
				path: 'products',
				data: { meta: { ...meta('/admin/products'), titleSuffix: '' } },
				loadComponent: () =>
					import('./pages/admin/products/products.component').then((m) => m.ProductsComponent),
			},
			{
				path: 'orders',
				data: { meta: { ...meta('/admin/orders'), titleSuffix: '' } },
				loadComponent: () => import('./pages/admin/orders/orders.component').then((m) => m.OrdersComponent),
			},
			{
				path: 'customers',
				data: { meta: { ...meta('/admin/customers'), titleSuffix: '' } },
				loadComponent: () =>
					import('./pages/admin/customers/customers.component').then((m) => m.CustomersComponent),
			},
		],
	},
	{
		path: 'admin/sign',
		data: { meta: { ...meta('/admin/sign'), titleSuffix: '' } },
		loadComponent: () => import('./pages/admin/sign/sign.component').then((m) => m.SignComponent),
	},
	{
		path: '**',
		redirectTo: '',
	},
];
