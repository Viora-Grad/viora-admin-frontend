import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

interface CodeClient {
	requestCode: () => void;
}

declare const google: {
	accounts: {
		oauth2: {
			initCodeClient: (config: {
				// eslint-disable-next-line @typescript-eslint/naming-convention
				client_id: string;
				// eslint-disable-next-line @typescript-eslint/naming-convention
				redirect_uri: string;
				// eslint-disable-next-line @typescript-eslint/naming-convention
				ux_mode: 'redirect' | 'popup';
				scope: string;
			}) => CodeClient;
		};
	};
};

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
	private _scriptReady: Promise<void> | null = null;

	public initialize(): void {
		if (this._scriptReady) return;

		this._scriptReady = new Promise<void>((resolve) => {
			const script = document.createElement('script');
			script.src = 'https://accounts.google.com/gsi/client';
			script.async = true;
			script.defer = true;
			document.head.appendChild(script);

			script.onload = () => {
				resolve();
			};
		});
	}

	public async redirectToGoogle(): Promise<void> {
		this.initialize();
		await this._scriptReady;

		const client = google.accounts.oauth2.initCodeClient({
			// eslint-disable-next-line @typescript-eslint/naming-convention
			client_id: environment.googleClientId,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			redirect_uri: environment.googleRedirectUri,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			ux_mode: 'redirect',
			scope: 'openid email profile',
		});

		client.requestCode();
	}
}
