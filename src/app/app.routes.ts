import { Routes } from '@angular/router';
import { buildRouteMeta } from '@wawjs/ngx-default';
import { companyProfile } from './feature/company/company.data';

export const routes: Routes = [
	{
		path: '',
		data: {
			meta: {
				...buildRouteMeta(companyProfile, '/'),
				titleSuffix: '',
			},
		},
		loadComponent: () =>
			import('./pages/landing/landing.component').then((m) => m.LandingComponent),
	},
	{
		path: 'about-company',
		data: {
			meta: buildRouteMeta(companyProfile, '/about-company'),
		},
		loadComponent: () =>
			import('./pages/about-company/about-company.component').then(
				(m) => m.AboutCompanyComponent,
			),
	},
	{
		path: 'about-water',
		data: {
			meta: buildRouteMeta(companyProfile, '/about-water'),
		},
		loadComponent: () =>
			import('./pages/about-water/about-water.component').then(
				(m) => m.AboutWaterComponent,
			),
	},
	{
		path: '**',
		redirectTo: '',
	},
];
