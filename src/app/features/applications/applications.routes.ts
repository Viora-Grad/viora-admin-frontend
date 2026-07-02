import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/guards/auth.guard';

export const APPLICATIONS_ROUTES: Routes = [
	{
		path: '',
		canActivate: [authGuard],
		loadComponent: () => import('./pages/applications.page').then(m => m.ApplicationsPage),
	},
	{
		path: ':id',
		canActivate: [authGuard],
		loadComponent: () => import('../applicationDetails/pages/applicationDetails.page').then(m => m.ApplicationDetailPage),
	},
];