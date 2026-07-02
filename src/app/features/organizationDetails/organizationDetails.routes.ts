import { Routes } from '@angular/router';

export const ORGANIZATIONDETAILS_ROUTES: Routes = [
	{
		path: '',
		loadComponent: () => import('./pages/organizationDetails.page').then((m) => m.OrganizationDetailsPage),
	},
];