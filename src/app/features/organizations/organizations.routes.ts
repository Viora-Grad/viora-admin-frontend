import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/guards/auth.guard';

export const ORGANIZATIONS_ROUTES: Routes = [
	{
		path: '',
		canActivate: [authGuard],
		loadComponent: () => import('./pages/organizations.page').then(m => m.OrganizationsPage),
	},
	{
		path: ':id',
		canActivate: [authGuard],
		loadComponent: () => import('../organizationDetails/pages/organizationDetails.page').then(m => m.OrganizationDetailsPage),
	},
];
