import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { GoogleAuthService } from '../../../../core/auth/services/google-auth.service';
import { GoogleButtonComponent } from '../../components/google-button/google-button.component';

@Component({
	selector: 'app-login-page',
	imports: [
		GoogleButtonComponent,
		RouterLink,
		ButtonModule,
		InputTextModule,
		PasswordModule,
		CheckboxModule,
		ReactiveFormsModule,
		IconFieldModule,
		InputIconModule,
		ToastModule,
	],
	templateUrl: './login.page.html',
	styleUrl: './login.page.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
	private readonly _authService = inject(AuthService);
	private readonly _googleAuthService = inject(GoogleAuthService);
	private readonly _messageService = inject(MessageService);

	public readonly isSubmitting = signal(false);

	public readonly form = new FormGroup({
		// eslint-disable-next-line @typescript-eslint/unbound-method
		email: new FormControl('', [Validators.required, Validators.email]),
		// eslint-disable-next-line @typescript-eslint/unbound-method
		password: new FormControl('', [Validators.required]),
		rememberMe: new FormControl(false),
	});

	public onGoogleLogin(): void {
		void this._googleAuthService.redirectToGoogle();
	}

	public onSubmit(): void {
		this.form.markAllAsTouched();

		if (this.form.invalid) return;

		const { email, password, rememberMe } = this.form.getRawValue();
		this.isSubmitting.set(true);

		this._authService.login(email!, password!, rememberMe ?? true).subscribe({
			next: () => {
				this.isSubmitting.set(false);
			},
			error: (err: { error?: { message?: string } }) => {
				this.isSubmitting.set(false);
				this._messageService.add({
					severity: 'error',
					summary: 'Login Failed',
					detail: err?.error?.message ?? 'Invalid email or password.',
					life: 5000,
				});
			},
		});
	}
}