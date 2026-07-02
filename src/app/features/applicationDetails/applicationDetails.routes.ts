import { Routes } from '@angular/router';

export const APPLICATIONSDETAILS_ROUTES: Routes = [
	{
		path: '',
		loadComponent: () => import('./pages/applicationDetails.page').then((m) => m.ApplicationDetailPage),
	},
];