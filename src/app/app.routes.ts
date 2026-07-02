import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'applications',
    canActivate: [authGuard],
    loadChildren: () => import('./features/applications/applications.routes').then(m => m.APPLICATIONS_ROUTES)
  },
  {
    path: 'organizations',
    canActivate: [authGuard],
    loadChildren: () => import('./features/organizations/organizations.routes').then(m => m.ORGANIZATIONS_ROUTES)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/authentication/authentication.routes').then(m => m.AUTHENTICATION_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];