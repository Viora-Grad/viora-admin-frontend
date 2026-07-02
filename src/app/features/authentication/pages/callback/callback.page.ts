import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
	selector: 'app-callback-page',
	imports: [ProgressSpinnerModule, ToastModule],
	providers: [MessageService],
	template: `
		<p-toast />
		<div class="min-h-screen flex items-center justify-center bg-gray-50/50">
			<div class="text-center">
				<p-progressSpinner [strokeWidth]="'4'" />
				<p class="mt-4 text-gray-500 font-medium">Completing sign in...</p>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallbackPage implements OnInit {
	private readonly _route = inject(ActivatedRoute);
	private readonly _router = inject(Router);
	private readonly _authService = inject(AuthService);
	private readonly _messageService = inject(MessageService);

	private static readonly GOOGLE_AUTH_FLOW_KEY = 'google_auth_flow';
	private static readonly GOOGLE_AUTH_CODE_KEY = 'google_auth_code';

	public ngOnInit(): void {
		this._route.queryParams.subscribe((params) => {
			const code = params['code'] as string | undefined;
			const error = params['error'] as string | undefined;

			if (error) {
				this._messageService.add({
					severity: 'error',
					summary: 'Authentication Failed',
					detail: (params['error_description'] as string) ?? 'Google authentication failed. Please try again.',
					life: 5000,
				});
				sessionStorage.removeItem(CallbackPage.GOOGLE_AUTH_FLOW_KEY);
				setTimeout(() => {
					void this._router.navigate(['/auth/login']);
				}, 2000);
				return;
			}

			if (code) {
				// const flow = sessionStorage.getItem(CallbackPage.GOOGLE_AUTH_FLOW_KEY);

				// if (flow === 'register') {
				// 	sessionStorage.removeItem(CallbackPage.GOOGLE_AUTH_FLOW_KEY);
				// 	sessionStorage.setItem(CallbackPage.GOOGLE_AUTH_CODE_KEY, code);
				// 	void this._router.navigate(['/auth/register']);
				// 	return;
				// }

				this._authService.loginWithGoogle(code).subscribe({
					error: () => {
						void this._router.navigate(['/auth/login']);
					},
				});
			} else {
				void this._router.navigate(['/auth/login']);
			}
		});
	}
}