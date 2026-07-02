import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthStore } from '../store/auth.store';
import { AuthService } from '../services/auth.service';

const AUTH_ENDPOINTS = ['/auth/login', '/auth/google', '/auth/refresh', '/auth/logout', '/auth/validate', '/oauth/google/validate', '/auth/oauth/'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const authStore = inject(AuthStore);
	const authService = inject(AuthService);

	const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) => req.url.includes(endpoint));

	if (isAuthEndpoint) {
		return next(req);
	}

	const accessToken = authStore.accessToken();

	if (accessToken) {
		req = req.clone({
			setHeaders: {
				// eslint-disable-next-line @typescript-eslint/naming-convention
				Authorization: `Bearer ${accessToken}`,
			},
		});
	}

	return next(req).pipe(
		catchError((error: HttpErrorResponse) => {
			if (error.status === 401 && authStore.refreshToken()) {
				return authService.refreshTokens().pipe(
					switchMap(() => {
						const newAccessToken = authStore.accessToken();
						const retryReq = req.clone({
							setHeaders: {
								// eslint-disable-next-line @typescript-eslint/naming-convention
								Authorization: `Bearer ${newAccessToken}`,
							},
						});
						return next(retryReq);
					}),
					catchError((refreshError: unknown) => {
						authService.logout();
						return throwError(() => refreshError);
					}),
				);
			}
			return throwError(() => error);
		}),
	);
};
